'use strict';

(function () {

  var mapFilters = document.querySelector('.map__filters-container');

  function openOfferCard(data) {
    window.card.close();
    window.map.element.insertBefore(window.card.getLayout(data), mapFilters);
    document.addEventListener('keydown', window.card.escHandler);
  }

  function getPinItemLayout(data) {
    var pinTemplate = document.querySelector('#pin')
                        .content
                        .querySelector('.map__pin');
    var pinItem = pinTemplate.cloneNode(true);
    pinItem.style.top = data.location.y + 'px';
    pinItem.style.left = data.location.x + 'px';
    pinItem.querySelector('img').src = data.author.avatar;
    pinItem.querySelector('img').alt = data.offer.title;
    pinItem.addEventListener('click', function () {
      openOfferCard(data);
      pinItem.classList.add('map__pin--active');
    });
    return pinItem;
  }

  window.getPin = getPinItemLayout;

})();
