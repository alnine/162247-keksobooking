'use strict';

(function () {

  var PriceLevels = {
    ANY: {min: 0, max: Infinity},
    LOW: {min: 0, max: 9999},
    MIDDLE: {min: 10000, max: 49999},
    HIGH: {min: 50000, max: Infinity}
  };

  var filterForm = document.querySelector('.map__filters');

  function filterChangeHandler() {
    window.util.debounce(function () {
      window.map.updateMapPins();
    });
  }

  function getFilterData() {
    var elements = filterForm.elements;
    var data = {
      features: []
    };

    for (var i = 0; i < elements.length; i++) {
      if (elements[i].className === 'map__filter') {
        data[elements[i].name] = elements[i].value;
      }

      if (elements[i].className === 'map__features') {
        var features = elements[i].elements;
        for (var k = 0; k < features.length; k++) {
          if (features[k].checked) {
            data.features.push(features[k].value);
          }
        }
      }
    }

    return data;
  }

  function isAdvertMatch(advert, filterOptions) {
    var type = filterOptions['housing-type'];
    var price = PriceLevels[filterOptions['housing-price'].toUpperCase()];
    var rooms = filterOptions['housing-rooms'];
    var guests = filterOptions['housing-guests'];
    var features = filterOptions.features;

    if (type !== 'any' && type !== advert.offer.type) {
      return false;
    }

    if (advert.offer.price < price.min ||
        advert.offer.price > price.max) {
      return false;
    }

    if (rooms !== 'any' &&
        rooms !== advert.offer.rooms.toString()) {
      return false;
    }

    if (guests !== 'any' &&
        guests !== advert.offer.guests.toString()) {
      return false;
    }

    for (var i = 0; i < features.length; i++) {
      if (advert.offer.features.indexOf(features[i]) < 0) {
        return false;
      }
    }

    return true;
  }

  function getFilteredAdverts(adverts) {
    var filterSelection = getFilterData();
    var result = adverts.filter(function (advert) {
      return isAdvertMatch(advert, filterSelection);
    });

    return result;
  }

  window.filter = {
    filterForm: filterForm,
    filterChangeHandler: filterChangeHandler,
    getFilteredAdverts: getFilteredAdverts
  };
})();

