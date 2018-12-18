'use strict';

(function () {

  var TAIL_HEIGHT = 9;
  var MAP_LIMIT_Y_MIN = 130;
  var MAP_LIMIT_Y_MAX = 630;
  var PINMAIN_START_X = 570;
  var PINMAIN_START_Y = 375;
  var isPageActive = false;
  var map = document.querySelector('.map');
  var mapPinsBlock = document.querySelector('.map__pins');
  var pinMain = mapPinsBlock.querySelector('.map__pin--main');
  var form = document.querySelector('.ad-form');
  var formFieldsets = form.querySelectorAll('fieldset');
  var formAddressField = form.querySelector('#address');

  function renderPins(list) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < list.length; i++) {
      if (list[i].offer) {
        var pin = window.pin(list[i]);
        fragment.appendChild(pin);
      }
    }
    mapPinsBlock.appendChild(fragment);
  }

  var filter = map.querySelector('.map__filters');
  var baseData = [];
  var filterData = {};
  var PriceLevels = {
    any: {min: 0, max: Infinity},
    low: {min: 0, max: 9999},
    middle: {min: 10000, max: 49999},
    high: {min: 50000, max: Infinity}
  };

  function getFilterData() {
    var initialData = new FormData(filter);
    var entries = initialData.entries();
    var entry;
    var data = {
      features: [],
    };

    while (!(entry = entries.next()).done) {
      if (entry.value[0] === 'features') {
        data.features.push([entry.value[1]]);
      } else {
        data[entry.value[0]] = entry.value[1];
      }
    }

    data.rate = data.features.length + 4;
    return data;
  }

  function getRate(advert) {
    advert.rate = 0;
    var type = filterData['housing-type'];
    var rooms = filterData['housing-rooms'];
    var guests = filterData['housing-guests'];
    var price = PriceLevels[filterData['housing-price']];

    if (type === 'any' ||
        type === advert.offer.type) {
      advert.rate += 1;
    }

    if (rooms === 'any' ||
        rooms === advert.offer.rooms.toString()) {
      advert.rate += 1;
    }

    if (guests === 'any' ||
        guests === advert.offer.guests.toString()) {
      advert.rate += 1;
    }

    filterData.features.forEach(function (item) {
      if (advert.offer.features.indexOf(item[0]) >= 0) {
        advert.rate += 1;
      }
    });

    if (advert.offer.price > price.min &&
        advert.offer.price < price.max) {
      advert.rate += 1;
    }
  }

  function updateMapPins() {
    cleanMap();
    filterData = getFilterData();
    renderPins(baseData.map(function (item) {
      getRate(item);
      return item;
    })
      .filter(function (item) {
        return item.rate === filterData.rate;
      })
    );
  }

  function activateMap(data) {
    baseData = data;
    map.classList.remove('map--faded');
    renderPins(data);
  }

  function cleanMap() {
    window.card.closeOfferCard();
    var pinButtons = mapPinsBlock.querySelectorAll('.map__pin[type=button]');
    pinButtons.forEach(function (pin) {
      mapPinsBlock.removeChild(pin);
    });
  }

  function activatePage() {
    if (!isPageActive) {
      window.backend.load(activateMap, window.popup.errorHandler);
      form.classList.remove('ad-form--disabled');
      formFieldsets.forEach(function (field) {
        field.disabled = false;
      });
      isPageActive = true;
      filter.addEventListener('change', function () {
        updateMapPins();
      });
    }
  }

  function deactivatePage() {
    cleanMap();
    map.classList.add('map--faded');
    form.classList.add('ad-form--disabled');
    formFieldsets.forEach(function (field) {
      field.disabled = true;
    });
    pinMain.style.left = PINMAIN_START_X + 'px';
    pinMain.style.top = PINMAIN_START_Y + 'px';
    var pinMainCoord = getPinCenterCoords(pinMain);
    fillValueAddressField(pinMainCoord);
    isPageActive = false;
  }

  function getPinCenterCoords(pin) {
    var pinX = Math.floor(pin.offsetLeft + pin.clientWidth / 2);
    var pinY = Math.floor(pin.offsetTop + pin.clientHeight / 2);
    return {x: pinX, y: pinY};
  }

  function getPinTailCoords(pin) {
    var pinX = Math.floor(pin.offsetLeft + pin.clientWidth / 2);
    var pinY = Math.floor(pin.offsetTop + pin.clientHeight + TAIL_HEIGHT);
    return {x: pinX, y: pinY};
  }

  function fillValueAddressField(coords) {
    formAddressField.value = coords.x + ', ' + coords.y;
  }

  var pinMainStartCoords = getPinCenterCoords(pinMain);
  fillValueAddressField(pinMainStartCoords);

  for (var i = 0; i < formFieldsets.length; i++) {
    formFieldsets[i].disabled = true;
  }

  pinMain.addEventListener('mousedown', function (downEvt) {
    downEvt.preventDefault();

    var startCoords = {
      x: downEvt.pageX,
      y: downEvt.pageY
    };

    var addressCoords = {};

    function onPinMouseMove(moveEvt) {
      moveEvt.preventDefault();
      activatePage();

      var borders = {
        top: MAP_LIMIT_Y_MIN - pinMain.clientHeight - TAIL_HEIGHT,
        bottom: MAP_LIMIT_Y_MAX - pinMain.clientHeight - TAIL_HEIGHT,
        left: 0 - pinMain.clientWidth / 2,
        right: map.clientWidth - pinMain.clientWidth / 2
      };

      var shift = {
        x: startCoords.x - moveEvt.pageX,
        y: startCoords.y - moveEvt.pageY
      };

      var pinShifted = {
        x: pinMain.offsetLeft - shift.x,
        y: pinMain.offsetTop - shift.y
      };

      if (pinShifted.x >= borders.left && pinShifted.x <= borders.right) {
        pinMain.style.left = pinShifted.x + 'px';
      }

      if (pinShifted.y >= borders.top && pinShifted.y <= borders.bottom) {
        pinMain.style.top = pinShifted.y + 'px';
      }

      addressCoords = getPinTailCoords(pinMain);
      fillValueAddressField(addressCoords);

      startCoords = {
        x: moveEvt.pageX,
        y: moveEvt.pageY
      };
    }

    function onPinMouseUp(upEvt) {
      upEvt.preventDefault();
      activatePage();
      addressCoords = getPinTailCoords(pinMain);
      fillValueAddressField(addressCoords);
      document.removeEventListener('mousemove', onPinMouseMove);
      document.removeEventListener('mouseup', onPinMouseUp);
    }

    document.addEventListener('mousemove', onPinMouseMove);
    document.addEventListener('mouseup', onPinMouseUp);
  });

  window.map = {
    deactivatePage: deactivatePage
  };

})();
