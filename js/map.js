'use strict';

(function () {

  var OFFERS_COUNT = 8;
  var TAIL_HEIGHT = 9;
  var MAP_LIMIT_Y_MIN = 130;
  var MAP_LIMIT_Y_MAX = 630;
  var data = window.data(OFFERS_COUNT);
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
      var pin = window.pin(list[i]);
      fragment.appendChild(pin);
    }
    return fragment;
  }

  function activatePage(pins) {
    if (!isPageActive) {
      map.classList.remove('map--faded');
      mapPinsBlock.appendChild(pins);
      form.classList.remove('ad-form--disabled');
      for (var i = 0; i < formFieldsets.length; i++) {
        formFieldsets[i].disabled = false;
      }
      isPageActive = true;
    }
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

  var pins = renderPins(data);
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
      activatePage(pins);

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
      activatePage(pins);
      addressCoords = getPinTailCoords(pinMain);
      fillValueAddressField(addressCoords);
      document.removeEventListener('mousemove', onPinMouseMove);
      document.removeEventListener('mouseup', onPinMouseUp);
    }

    document.addEventListener('mousemove', onPinMouseMove);
    document.addEventListener('mouseup', onPinMouseUp);
  });

})();
