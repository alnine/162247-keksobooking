'use strict';

(function () {

  var map = document.querySelector('.map');
  var mapFilters = map.querySelector('.map__filters-container');

  function openOfferCard(obj) {
    window.card.closeOfferCard();
    map.insertBefore(window.card.getOfferCardLayout(obj), mapFilters);
    document.addEventListener('keydown', window.card.offerCardEscHandler);
  }

  function getPinItemLayout(data) {
    var pinTemplate = document.querySelector('#pin')
                        .content
                        .querySelector('.map__pin');
    var pinItem = pinTemplate.cloneNode(true);
    pinItem.style.cssText = 'left: ' + data.location.x + 'px; '
                           + 'top: ' + data.location.y + 'px;';
    pinItem.querySelector('img').src = data.author.avatar;
    pinItem.querySelector('img').alt = data.offer.title;
    pinItem.addEventListener('click', function () {
      openOfferCard(data);
    });
    return pinItem;
  }

  window.pin = getPinItemLayout;

})();
