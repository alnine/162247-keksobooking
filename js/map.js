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

  function activatePage() {
    if (!isPageActive) {
      map.classList.remove('map--faded');
      window.backend.load(renderPins, window.popup.errorHandler);
      form.classList.remove('ad-form--disabled');
      for (var i = 0; i < formFieldsets.length; i++) {
        formFieldsets[i].disabled = false;
      }
      isPageActive = true;
    }
  }

  function deactivatePage() {
    var pinButtons = mapPinsBlock.querySelectorAll('.map__pin[type=button]');
    window.card.closeOfferCard();
    map.classList.add('map--faded');
    form.classList.add('ad-form--disabled');
    for (var i = 0; i < pinButtons.length; i++) {
      mapPinsBlock.removeChild(pinButtons[i]);
    }
    for (var k = 0; k < formFieldsets.length; k++) {
      formFieldsets[k].disabled = true;
    }
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
