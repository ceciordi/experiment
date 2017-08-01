$(function () {

    'use strict';

	var $body = $('body'),
		$fauxHeader = $('.page-header.faux-header'),
		$monstersIntroView = $('#monsters-intro-view'),
		$monstersIntroContainer = $('.monsters-for-intro', $monstersIntroView),
		$cards = $('.cards > .card-container');
		$cards.on('click', function (e) {
			e.currentTarget.classList.toggle('active');
		});

	// Listen for a tag clicks
	var $aTags = $('a');
        $aTags.on('click', function (e) {
        	var hash = e.currentTarget.hash;
			if (hash.indexOf('#') > -1) {
				var $foundElm = $(hash);
				if ($foundElm.length > 0) {
					var pageHeaderHeight = $fauxHeader.height() + 34;
                    $body.animate({scrollTop: $foundElm.offset().top - pageHeaderHeight +  'px'}, 1000);
                }
			}
        });

	function initMonstersIntro ($monstersParentContainer) {
		var $monsters = $('> div', $monstersParentContainer),
			monsterWidth = $monsters.eq(0).width(),
			monstersLength = $monsters.length,
			totalMonstersWidth = monsterWidth * monstersLength;

		// Get all monster divs
		$monsters.each(function (ind, element) {

			// Initial values needed for position images randomly
			var speed = 2,
				x = ind * monsterWidth,
				$elm = $(element);

			// Store animation values using jQuery.data()
			$elm.data('monsterX', x);

			// Randomly position our monster in preparation for our animation
			// Es6 Template Strings usage (see mdn 'template literal')
			$elm.css('transform', `translateX(${x}px)`);

            function animateMonster () {
            	// `dx` means dynamic x
            	var dx = $elm.data('monsterX');
				if (dx + monsterWidth < 0) {
					dx = totalMonstersWidth - monsterWidth;
				}
				dx -= speed;
				$elm.css('transform', `translateX(${dx}px)`);
				$elm.data('monsterX', dx);
				requestAnimationFrame(animateMonster);
            }

            requestAnimationFrame(animateMonster);
        });
	}

    initMonstersIntro($monstersIntroContainer);

});
