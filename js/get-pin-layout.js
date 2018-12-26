'use strict';

(function () {

  var template = document.querySelector('#pin')
                         .content
                         .querySelector('.map__pin');

  function getPinLayout(data) {
    var element = template.cloneNode(true);
    element.style.top = data.location.y + 'px';
    element.style.left = data.location.x + 'px';
    element.querySelector('img').src = data.author.avatar;
    element.querySelector('img').alt = data.offer.title;
    element.addEventListener('click', function () {
      window.card.open(data);
      element.classList.add('map__pin--active');
    });
    return element;
  }

  window.getPinLayout = getPinLayout;

})();
