'use strict';

(function () {

  var PriceLevels = {
    any: {min: 0, max: Infinity},
    low: {min: 0, max: 9999},
    middle: {min: 10000, max: 49999},
    high: {min: 50000, max: Infinity}
  };

  function getFilterData(filterForm) {
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

  function filtrateOffer(advert, filterValue) {
    var type = filterValue['housing-type'];
    var price = PriceLevels[filterValue['housing-price']];
    var rooms = filterValue['housing-rooms'];
    var guests = filterValue['housing-guests'];
    var features = filterValue.features;

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

  window.filter = {
    getFilterData: getFilterData,
    filtrateOffer: filtrateOffer
  };
})();

