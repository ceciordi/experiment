$(function () {
	var $body = $('body'),
		$fauxHeader = $('.page-header.faux-header'),
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

        function initMonstersIntro ($monstersIntro) {
        	$monstersIntro.find('.monster').each(function (ind, element) {
        		element
				// Random x and y based on stage dimensions
				// Random distance based on stage height
				// Scale based on random distance
				// Set to animate
			});
		}

});
