'use strict';

(function () {

  var TAIL_HEIGHT = 9;
  var LIMIT_Y_MIN = 130;
  var LIMIT_Y_MAX = 630;
  var PINMAIN_START_X = 570;
  var PINMAIN_START_Y = 375;
  var MAX_PIN_RENDER = 5;
  var isPageActive = false;
  var element = document.querySelector('.map');
  var pinsBlock = document.querySelector('.map__pins');
  var pinMain = pinsBlock.querySelector('.map__pin--main');
  var initialAdsData = [];

  function renderPins(data) {
    var fragment = document.createDocumentFragment();
    var maxPinsOnMap = Math.min(data.length, MAX_PIN_RENDER);
    for (var i = 0; i < maxPinsOnMap; i++) {
      if (data[i].offer) {
        var pin = window.getPinLayout(data[i]);
        fragment.appendChild(pin);
      }
    }
    pinsBlock.appendChild(fragment);
  }

  function activate(data) {
    element.classList.remove('map--faded');
    renderPins(data);
    window.filter.element.addEventListener('change', window.filter.changeHandler);
  }

  function clean() {
    window.card.close();
    var pinElements = pinsBlock.querySelectorAll('.map__pin[type=button]');
    pinElements.forEach(function (pin) {
      pinsBlock.removeChild(pin);
    });
  }

  function updateRenderPins() {
    clean();
    renderPins(window.filter.getFilteredAdverts(initialAdsData));
  }

  function deactivate() {
    element.classList.add('map--faded');
    clean();
    window.filter.element.removeEventListener('change', window.filter.changeHandler);
  }

  function successDataLoadHandler(data) {
    initialAdsData = data;
    activate(initialAdsData);
    window.form.activate();
    isPageActive = true;
  }

  function activatePage() {
    if (!isPageActive) {
      window.backend.load(successDataLoadHandler, window.popup.errorHandler);
    }
  }

  function deactivatePage() {
    if (isPageActive) {
      deactivate();
      window.form.deactivate();
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

  pinMain.addEventListener('mousedown', function (downEvt) {
    downEvt.preventDefault();

    var startCoord = {
      x: downEvt.pageX,
      y: downEvt.pageY
    };

    var addressCoord = {};

    function pinMouseMoveHandler(moveEvt) {
      moveEvt.preventDefault();
      activatePage();

      var borders = {
        top: LIMIT_Y_MIN - pinMain.clientHeight - TAIL_HEIGHT,
        bottom: LIMIT_Y_MAX - pinMain.clientHeight - TAIL_HEIGHT,
        left: 0 - pinMain.clientWidth / 2,
        right: element.clientWidth - pinMain.clientWidth / 2
      };

      var shift = {
        x: startCoord.x - moveEvt.pageX,
        y: startCoord.y - moveEvt.pageY
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

      addressCoord = getPinTailCoords(pinMain);
      window.form.fillValueAddressField(addressCoord);

      startCoord = {
        x: moveEvt.pageX,
        y: moveEvt.pageY
      };
    }

    function pinMouseUpHandler(upEvt) {
      upEvt.preventDefault();
      activatePage();
      addressCoord = getPinTailCoords(pinMain);
      window.form.fillValueAddressField(addressCoord);
      document.removeEventListener('mousemove', pinMouseMoveHandler);
      document.removeEventListener('mouseup', pinMouseUpHandler);
    }

    document.addEventListener('mousemove', pinMouseMoveHandler);
    document.addEventListener('mouseup', pinMouseUpHandler);
  });

  window.map = {
    element: element,
    deactivatePage: deactivatePage,
    updateRenderPins: updateRenderPins
  };

})();
