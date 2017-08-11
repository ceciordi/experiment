$(function () {

    'use strict';

	var $body = $('body'),
        $pageHeader = $('.page-header').eq(0),
		$fauxHeader = $('.page-header.faux-header'),
		$monstersIntroView = $('#monsters-intro-view'),
		$monstersIntroContainer = $('.monsters-for-intro', $monstersIntroView),
	 	$aTags = 					$('a');

    // Listen for a tag clicks
    $aTags.on('click', function (e) {
        var hash = e.currentTarget.hash;
        e.preventDefault();
        if (hash.indexOf('#') > -1 && hash.length > 0) {
            clearIntervals();
            clearTrackedCards();
            var $foundElm = $(hash);
            if ($foundElm.length > 0) {
                var pageHeaderHeight = $fauxHeader.height() + 34;
                $body.animate({scrollTop: 0 /*$foundElm.offset().top - pageHeaderHeight +  'px'*/}, 1000);
                if ($pageHeader.hasClass('menu-expanded')) {
                    $pageHeader.removeClass('menu-expanded');
                }
                showView(hash);
            }
        }
    });

    // Populate and start monsters intro
    populateMonstersIntro()
        .then(function () {
            initMonstersIntro($monstersIntroContainer);
            showWelcomeView();
            buildLeaderBoard();
        });

    function initMonstersIntro ($monstersParentContainer) {
        var $monsters = $('> div', $monstersParentContainer),
            monsterWidth = $monsters.eq(0).width(),
            monstersLength = $monsters.length,
            totalMonstersWidth = monsterWidth * monstersLength;

        // Get all monster divs
        $monsters.each(function (ind, element) {

            // Initial values needed for position images
            var speed = 2,
                x = ind * monsterWidth,
                $elm = $(element);

            // Store animation values using jQuery.data() to use later in animation function
            // ** instructions: https://api.jquery.com/jquery.data/
            $elm.data('monsterX', x);

            // Position each monster next to the previous one
            // Es6 Template Strings usage (see mdn 'template literal')
            $elm.css('transform', `translateX(${x}px)`);

            // Function that animates monster via requestAnimationFrame
            // ** instructions: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
            function animateMonster () {
                // `dx` means dynamic x
                var dx = $elm.data('monsterX');
                if (dx + monsterWidth < 0) {
                    dx = totalMonstersWidth - monsterWidth;
                }
                dx -= speed;
                $elm.css('transform', `translateX(${dx}px)`);
                $elm.data('monsterX', dx);

                // Helps run a function many times like setInterval but faster/better
                // ** instructions: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
                // ** and here: https://css-tricks.com/using-requestanimationframe/
                // Call monster animate again
                requestAnimationFrame(animateMonster);
            }

            // Call monster animate
            requestAnimationFrame(animateMonster);
        });
    }

    function populateMonstersIntro () {
        // Get monsters intro json (pass imagesByWidth to get only certain image sizes)
        return $.get('/get_monsters_intro.php', {imagesByWidth: 377})

        // Then for each monster, in json (`data`) add some html for it
            .then(function (data) {
                var monstersHtml = ``;
                data.forEach(function (monsterData) {
                    // Ensure that our data objects represent 'jpg' images
                    if (monsterData.ext !== 'jpg') {
                        return;
                    }
                    monstersHtml += `<div>
                            <img class="img-responsive" src="${monsterData.filePath}" alt="${monsterData.name} Manshtur Image.">
                            <div class="caption">
                                <p>${monsterData.name}</p>
                            </div>
                        </div>`;
                });
                $monstersIntroContainer.html('').append(monstersHtml);
            });
    }

    function initMobileMenu () {
        $('.hamburger', $pageHeader).click(function (e) {
            $pageHeader.toggleClass('menu-expanded');
        });
    }

    initMobileMenu();

    // Preliminaries before writing the game code
    // ------------------------------------------------
    // 1.  Get the top level element for the application
    //   That element in this case is '<div id="wrapper">...</div>'
    var $wrapperElm =               $('#wrapper'),

        // 2.  Define our selectors that we are reusing in our code
        chooseDifficultyViewSel =   '#choose-difficulty-view',
        welcomeViewSel =            '#monsters-intro-view',
        gameViewSel =               '#game-view',
        gameSummaryViewSel =        '#game-summary-view',
        gameOverViewSel =           '#game-over-view',
        cardsSel =                  '> .card-container',

        // 3.  Select all game views and elements needed
        // ** See http: //api.jquery.com/jQuery/
        // (Get the context from within the selector.)
        // -----------------------------------------------
        $chooseDifficultyView =     $(chooseDifficultyViewSel, $wrapperElm),
        $gameView =                 $(gameViewSel, $wrapperElm),
        $gameTimer =                $('.game-timer .value', $gameView),
        $gameSummaryView =          $(gameSummaryViewSel, $wrapperElm),
        $gameLeaderBoardView =      $('#game-leader-board-view', $wrapperElm),
        $gameViewScoreElm =         $('.user-score .value', $gameView),
        $views =                    $('.main-content .view', $wrapperElm),
        $cardsHolder =              $('.cards', $wrapperElm),

        // Game settings
        // ------------------------------------------------
        // Css class for changing the opacity on the '.view' elements
        activeClassName =           'active',

        // Css class for showing when a card has been double clicked
        dblClickedClassName =       'active-via-dblclick',

        // Default difficulty to use for the game
        defaultDifficulty =         'easy',

        // Game time durations by difficulty
        easyGameDuration =         20 * 1000, // 60 seconds
        medGameDuration =          50 * 1000, // 60 seconds
        hardGameDuration =         120 * 1000, // 60 seconds

        // Game over screen duration
        gameOverScreenDuration =    3 * 1000,

        // Time up screen duration
        timeUpAndSummaryDuration =  3 * 1000,

        // Variables for tracking the interval calls we make
        // so that we can stop them whenever we need to and not allow them
        // to run wild
        gameOverScreenInterval =    null,
        gameSummaryScreenInterval = null,
        gameScreenInterval =        null,
        leaderBoardScreenInterval = null,

        // Variables for game logic
        $lastCardSingleClicked =    null,  // Current card single clicked  after a card has been double clicked
        $currentCardDoubleClicked = null,  // Current card double clicked
        $lastCardDoubleClicked =    null,  // Last card double clicked
        gameDataPrototype = {
            pointsPerCard: 100,
            points: 0,
            pairsFound: 0,
            numPairs: 0,
            timeElapsed: 0
        },

        // We store the current game session data
        gameData;

    function createNewGameData () {
        gameData = Object.create(gameDataPrototype);
    }

    function showView (id) {
        $views.removeClass('active');
        return $views.filter(id).addClass('active');
    }

    function showWelcomeView () {
        showView(welcomeViewSel);
    }

    function showChooseDifficultyView () {
        return showView(chooseDifficultyViewSel);
    }

    function recordUserStats (stats) {
        console.log(stats);
        var statsToSend = {
            tag: 'guest',
            difficulty: stats.difficulty,
            duration: stats.timeElapsed,
            score: stats.pairsFound * 100,
            date: (new Date()).getTime()
        };
        return $.post('/add_to_leader_board.php', statsToSend)
            .then(function (result) {
                if (result.error) { throw new Error(result.error); }
                return buildLeaderBoard();
            }, alert);
    }

    function showTimeUpAndSummary ($cards) {
        $gameSummaryView.find('.pairs-found').text(gameData.pairsFound);
        $gameSummaryView.find('.num-pairs').text(gameData.numPairs);
        $gameSummaryView.find('.num-seconds-taken').text(gameData.timeElapsed);
        removeCardsEventListeners($cards);
        showView(gameSummaryViewSel);
        recordUserStats(gameData);
        var duration = timeUpAndSummaryDuration;
        gameSummaryScreenInterval = setInterval(function () {
            if (duration <= 0) {
                showGameOverView();
                clearInterval(gameSummaryScreenInterval);
            }
            duration -= 1000;
        }, 1000);
    }

    function showGameView () {
        $gameViewScoreElm.text('0');
        buildGameBoard()
            .then(function () {
                startGameTimer(addCardsEventListeners($(cardsSel, $cardsHolder)));
                showView(gameViewSel);
            });
    }

    function buildGameBoard () {
        return $.get('/get_monsters_list.php', {difficulty: gameData.difficulty, imagesByWidth: 987})
            .then(function (data) {
                var cardsHtml = ``;
                data.forEach(function (monsterData) {
                    // Ensure that our data objects represent 'jpg' images
                    if (monsterData.ext !== 'jpg') {
                        return;
                    }
                    cardsHtml +=
                        `<div class="card-container" data-name="${monsterData.name} Manshtur" data-ext="${monsterData.ext}">
                            <div class="card">
                                <div class="card-face-front card-face"
                                     style="background: #fff url(${monsterData.filePath}) no-repeat center center; background-size: 89%;">
                                </div>
                                <div class="card-face-back card-face"><!--BACK--></div>
                            </div>
                        </div>`
                });
                $cardsHolder.html('').append(cardsHtml);
            });
    }

    function showGameOverView () {
        showView(gameOverViewSel);
        var duration = gameOverScreenDuration;
        gameOverScreenInterval = setInterval(function () {
            if (duration <= 0) {
                showLeaderBoardView();
                clearInterval(gameOverScreenInterval);
            }
            duration -= 1000;
        }, 1000);
    }

    function buildLeaderBoard () {
        return $.get('/get_leader_board.php')
            .then(function (data) {
                var out = `<tbody>`;
                data.data.forEach(function (row) {
                    var rowDate = new Date(row.date),
                        dateToShow = (rowDate.getMonth() + 1) + '/' +
                            rowDate.getDate() + '/' +
                            (rowDate.getFullYear() + '').substring(2, 4);
                    out +=  `
                         <tr>
                            <td>${row.tag}</td>
                            <td>${row.score}</td>
                            <td>${row.difficulty}</td>
                            <td>${row.duration}</td>
                            <td>${dateToShow}</td>
                        </tr>
                            `;
                });
                out += `</tbody>`;
                $gameLeaderBoardView.find('table > tbody').replaceWith(out);
            });
    }

    function showLeaderBoardView () {
        showView('#game-leader-board-view');
        var duration = gameOverScreenDuration * 2;
        leaderBoardScreenInterval = setInterval(function () {
            if (duration <= 0) {
                showWelcomeView();
                clearInterval(leaderBoardScreenInterval);
            }
            duration -= 1000;
        }, 1000);
    }

    function getGameDurationByDifficulty (difficulty) {
        switch (difficulty) {
            case 'easy': return easyGameDuration;
            case 'medium': return medGameDuration;
            case 'hard': return hardGameDuration;
            default: return easyGameDuration;
        }
    }

    function startGameTimer ($cards) {
        gameData.numPairs = $cards.length / 2;
        gameData.timeElapsed = getGameDurationByDifficulty(gameData.difficulty);
        var gameDuration = gameData.timeElapsed; // 60 seconds later than now
        gameScreenInterval= setInterval(function () {
            var beatGame = gameData.numPairs === gameData.pairsFound;
            gameDuration -= 1000;
            $gameTimer.text(gameDuration / 1000);
            if (gameDuration <= 0 || beatGame) {
                gameData.timeElapsed = (easyGameDuration - gameDuration) / 1000;
                showTimeUpAndSummary($cards);
                clearInterval(gameScreenInterval);
            }
        }, 1000);
    }

    function cardsAreEqual ($card1, $card2) {
        return $card1 && $card2 && $card1.data('name') === $card2.data('name');
    }

    function makeMatched ($card1, $card2) {
        $card1.addClass(activeClassName, dblClickedClassName);
        $card1.off('mousedown', onCardMouseDown);
        $card1.off('mouseup', onCardMouseUp);
        $card1.off('dblclick', onCardDoubleClick);
        $card2.addClass(activeClassName, dblClickedClassName);
        $card2.off('mousedown', onCardMouseDown);
        $card2.off('mouseup', onCardMouseUp);
        $card2.off('dblclick', onCardDoubleClick);
        gameData.points += gameData.pointsPerCard;
        gameData.pairsFound += 1;
        $gameViewScoreElm.text(gameData.points);
        clearTrackedCards();
    }

    function makeUnMatched ($card1, $card2) {
        if ($card1) {
            $card1.removeClass(activeClassName, dblClickedClassName);
        }
        if ($card2) {
            $card2.removeClass(activeClassName, dblClickedClassName);
        }
        clearTrackedCards();
    }

    function clearTrackedCards () {
        $lastCardSingleClicked =
            $currentCardDoubleClicked =
                $lastCardDoubleClicked = null;
    }

    function clearIntervals () {
        clearInterval(gameScreenInterval);
        clearInterval(gameOverScreenInterval);
        clearInterval(gameSummaryScreenInterval);
    }

    function onCardMouseDown(e) {
        var $elm = $(e.currentTarget);
        if (!$elm.hasClass(dblClickedClassName)) {
            $elm.addClass(activeClassName);
        }
    }

    function onCardMouseUp(e) {
        var $card = $(e.currentTarget);
        if (!$currentCardDoubleClicked) {
            $lastCardDoubleClicked = null;
            $card.removeClass(activeClassName, dblClickedClassName);
            return;
        }
        else if(!$lastCardSingleClicked) {
            $lastCardSingleClicked = $card;
        }
        if (cardsAreEqual($currentCardDoubleClicked, $lastCardSingleClicked)) {
            makeMatched($currentCardDoubleClicked, $lastCardSingleClicked);
            return;
        }
        makeUnMatched($currentCardDoubleClicked, $lastCardSingleClicked);
    }

    function onCardDoubleClick (e) {
        var $elm = $(e.currentTarget);

        // If card has 'active-via-dblclick' class name remove it
        if ($elm.hasClass(dblClickedClassName)) {
            $elm.removeClass(activeClassName, dblClickedClassName);
            return;
        }

        // If no first card selected, select it and exit function call
        if (!$currentCardDoubleClicked) {
            $currentCardDoubleClicked = $elm;
            $currentCardDoubleClicked.addClass(activeClassName, dblClickedClassName);
            $lastCardDoubleClicked = null;
            return;
        }

        // If user double clicked again on the same card exit function call
        else if ($elm.get(0) === $currentCardDoubleClicked.get(0)) {
            return;
        }

        // If we don't have a last card clicked yet populate it
        // for comparison to "current-card-clicked"
        if (!$lastCardDoubleClicked) {
            $lastCardDoubleClicked = $elm;
            $lastCardDoubleClicked.addClass(activeClassName, dblClickedClassName);
        }

        // Compare cards and set class names if they are a match;
        // Also remove all listeners so that they are not interactive
        // anymore until next game.
        if (cardsAreEqual($currentCardDoubleClicked, $lastCardDoubleClicked)) {
            makeMatched($currentCardDoubleClicked, $lastCardDoubleClicked);
            return;
        }

        // Else cards weren't a match remove the "active" and "active-via-dblclick"
        // classes:
        makeUnMatched($currentCardDoubleClicked, $lastCardDoubleClicked);
    }

    function addCardsEventListeners ($cards) {
        return $cards.on('mousedown', onCardMouseDown)
            .on('mouseup',   onCardMouseUp)
            .on('dblclick',  onCardDoubleClick);
    }

    function removeCardsEventListeners ($cards) {
        return $cards.off('mousedown', onCardMouseDown)
            .off('mouseup',   onCardMouseUp)
            .off('dblclick',  onCardDoubleClick);
    }

    // Go to "choose difficulty" view
    $('.play-btn').click(function (e) {
        e.preventDefault();
        clearTrackedCards();
        clearIntervals();
        createNewGameData();
        showChooseDifficultyView();
    });

    // Start game with chosen difficulty
    $('a', $chooseDifficultyView).click(function (e) {
        e.preventDefault();
        var domElement = e.currentTarget;
        // Get 'data-difficulty' attribute value
        gameData.difficulty = domElement.dataset.difficulty || defaultDifficulty;
        showGameView();
    });


});
