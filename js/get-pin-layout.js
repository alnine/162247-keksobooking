'use strict';

(function () {

  var template = document.querySelector('#pin')
                         .content
                         .querySelector('.map__pin');

  function getPinLayout(data) {
    var item = template.cloneNode(true);
    item.style.top = data.location.y + 'px';
    item.style.left = data.location.x + 'px';
    item.querySelector('img').src = data.author.avatar;
    item.querySelector('img').alt = data.offer.title;
    item.addEventListener('click', function () {
      window.card.open(data);
      item.classList.add('map__pin--active');
    });
    return item;
  }

  window.getPinLayout = getPinLayout;

})();
