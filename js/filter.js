'use strict';

(function () {

  var PriceLevels = {
    ANY: {min: 0, max: Infinity},
    LOW: {min: 0, max: 9999},
    MIDDLE: {min: 10000, max: 49999},
    HIGH: {min: 50000, max: Infinity}
  };

  var element = document.querySelector('.map__filters');

  function changeHandler() {
    window.util.debounce(function () {
      window.map.updateRenderPins();
    });
  }

  function getFieldsData() {
    var fields = Array.from(element.elements);
    var data = {
      features: []
    };

    fields.forEach(function (field) {
      if (field.className === 'map__filter') {
        data[field.name] = field.value;
      }

      if (field.className === 'map__features') {
        var features = Array.from(field.elements);
        features.forEach(function (feature) {
          if (feature.checked) {
            data.features.push(feature.value);
          }
        });
      }
    });

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
    var fieldsData = getFieldsData();
    var result = adverts.filter(function (advert) {
      return isAdvertMatch(advert, fieldsData);
    });

    return result;
  }

  window.filter = {
    element: element,
    changeHandler: changeHandler,
    getFilteredAdverts: getFilteredAdverts
  };
})();

