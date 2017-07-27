window.addEventListener('load', function () {
	var cards = document.querySelectorAll('.cards > .card');
	for (i = 0; i < cards.length; i += 1) {
		var card = cards.item(i);
		card.addEventListener('click', function (e) {
			e.currentTarget.classList.toggle('active');
		});
	}
});
