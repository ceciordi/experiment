$(function () {

    'use strict';

	var $body = $('body'),
		$fauxHeader = $('.page-header.faux-header'),
		$monstersIntroView = $('#monsters-intro'),
		$monstersIntroContainer = $('.monsters-for-intro', $monstersIntroView),
		$cards = $('.cards > .card');
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

		// Get all monster divs
		$('> div', $monstersParentContainer).each(function (ind, element) {

			// Initial values needed for position images randomly
			var parentContainerWidth = $monstersParentContainer.width(),
				parentContainerHeight = $monstersParentContainer.height(),
				imgWidth = 377,
				imgHeight = 365,

				// Variables for animation
				distance = Math.random() * 200 + 1,
				speed = 20 / distance,
				initialScale = 1000 / distance * 0.01,
				scale = initialScale > 1 ? 1 : initialScale,

				// Random x and y based on parent container width and height
				x = Math.random() * parentContainerWidth - (imgWidth * scale / 2),
				y = Math.random() * parentContainerHeight - (imgHeight * scale / 2),

				$elm = $(element);

			console.log('z-index', distance * -1, 'scale', scale, 'x', x, 'y', y);

			// Store animation values using jQuery.data()
			$elm.data({
				monsterScale: scale,
				monsterSpeed: speed,
				monsterDistance: distance,
				monsterX: x,
				monsterY: y,
			});

			// Randomly position our monster in preparation for our animation
			$elm.css({
				left: x,
				top: y,
                transform: `scale(${scale}, ${scale})`,
                zIndex: Math.round(distance * -1)
            });

			// Set to animate
            //translate(${x}px, ${y}px)
        });
	}



    initMonstersIntro($monstersIntroContainer);

});
