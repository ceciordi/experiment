window.addEventListener('load', function () {
	var slice = Array.prototype.slice,
		cards = slice.call(document.querySelectorAll('.cards > .card'), 0);
	cards.forEach(function (card) {
		card.addEventListener('click', function (e) {
			e.currentTarget.classList.toggle('active');
		});
	});
});
