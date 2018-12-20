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

  function isAdMatch(ad, filterValue) {
    var type = filterValue['housing-type'];
    var price = PriceLevels[filterValue['housing-price'].toUpperCase()];
    var rooms = filterValue['housing-rooms'];
    var guests = filterValue['housing-guests'];
    var features = filterValue.features;

    if (type !== 'any' && type !== ad.offer.type) {
      return false;
    }

    if (ad.offer.price < price.min ||
        ad.offer.price > price.max) {
      return false;
    }

    if (rooms !== 'any' &&
        rooms !== ad.offer.rooms.toString()) {
      return false;
    }

    if (guests !== 'any' &&
        guests !== ad.offer.guests.toString()) {
      return false;
    }

    for (var i = 0; i < features.length; i++) {
      if (ad.offer.features.indexOf(features[i]) < 0) {
        return false;
      }
    }

    return true;
  }

  function getFilteredAds(adsData) {
    var filterSelection = getFilterData();
    var result = adsData.filter(function (ad) {
      return isAdMatch(ad, filterSelection);
    });

    return result;
  }

  window.filter = {
    filterChangeHandler: filterChangeHandler,
    getFilteredAds: getFilteredAds
  };
})();

