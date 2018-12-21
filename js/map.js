'use strict';

(function () {

  var TAIL_HEIGHT = 9;
  var MAP_LIMIT_Y_MIN = 130;
  var MAP_LIMIT_Y_MAX = 630;
  var PINMAIN_START_X = 570;
  var PINMAIN_START_Y = 375;
  var MAX_PIN_RENDER = 5;
  var isPageActive = false;
  var map = document.querySelector('.map');
  var mapPinsBlock = document.querySelector('.map__pins');
  var pinMain = mapPinsBlock.querySelector('.map__pin--main');
  var form = document.querySelector('.ad-form');
  var formFieldsets = form.querySelectorAll('fieldset');
  var filter = map.querySelector('.map__filters');
  var initialAdsData = [];

  function renderPins(list) {
    var fragment = document.createDocumentFragment();
    var maxPinsOnMap = Math.min(list.length, MAX_PIN_RENDER);
    for (var i = 0; i < maxPinsOnMap; i++) {
      if (list[i].offer) {
        var pin = window.pin(list[i]);
        fragment.appendChild(pin);
      }
    }
    mapPinsBlock.appendChild(fragment);
  }

  function activateMap(data) {
    map.classList.remove('map--faded');
    renderPins(data);
    filter.addEventListener('change', window.filter.filterChangeHandler);
  }

  function cleanMap() {
    window.card.closeOfferCard();
    var pinButtons = mapPinsBlock.querySelectorAll('.map__pin[type=button]');
    pinButtons.forEach(function (pin) {
      mapPinsBlock.removeChild(pin);
    });
  }

  function updateMapPins() {
    cleanMap();
    renderPins(window.filter.getFilteredAds(initialAdsData));
  }

  function deactivateMap() {
    map.classList.add('map--faded');
    cleanMap();
    filter.removeEventListener('change', window.filter.filterChangeHandler);
  }

  function successDataLoadHandler(data) {
    initialAdsData = data;
    activateMap(initialAdsData);
    window.form.activateForm();
    isPageActive = true;
  }

  function activatePage() {
    if (!isPageActive) {
      window.backend.load(successDataLoadHandler, window.popup.errorHandler);
    }
  }

  function deactivatePage() {
    if (isPageActive) {
      deactivateMap();
      window.form.deactivateForm();
    }
    pinMain.style.left = PINMAIN_START_X + 'px';
    pinMain.style.top = PINMAIN_START_Y + 'px';
    var pinMainCoord = getPinCenterCoords(pinMain);
    window.form.fillValueAddressField(pinMainCoord);
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

  var pinMainStartCoords = getPinCenterCoords(pinMain);
  window.form.fillValueAddressField(pinMainStartCoords);

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

    function pinMouseMoveHandler(moveEvt) {
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
      window.form.fillValueAddressField(addressCoords);

      startCoords = {
        x: moveEvt.pageX,
        y: moveEvt.pageY
      };
    }

    function pinMouseUpHandler(upEvt) {
      upEvt.preventDefault();
      activatePage();
      addressCoords = getPinTailCoords(pinMain);
      window.form.fillValueAddressField(addressCoords);
      document.removeEventListener('mousemove', pinMouseMoveHandler);
      document.removeEventListener('mouseup', pinMouseUpHandler);
    }

    document.addEventListener('mousemove', pinMouseMoveHandler);
    document.addEventListener('mouseup', pinMouseUpHandler);
  });

  window.map = {
    deactivatePage: deactivatePage,
    updateMapPins: updateMapPins
  };

})();
