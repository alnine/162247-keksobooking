'use strict';

(function () {

  var ESC_KEYCODE = 27;
  var DEBOUNCE_INTERVAL = 500;
  var lastTimeout;

  function getRandomIntegerFromInterval(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  }

  function getRandomElementFromArray(arr) {
    return arr[getRandomIntegerFromInterval(0, arr.length - 1)];
  }

  function isEscEvent(evt, action) {
    if (evt.keyCode === ESC_KEYCODE) {
      action();
    }
  }

  function debounce(callback) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(callback, DEBOUNCE_INTERVAL);
  }

  window.util = {
    getRandomIntegerFromInterval: getRandomIntegerFromInterval,
    getRandomElementFromArray: getRandomElementFromArray,
    isEscEvent: isEscEvent,
    debounce: debounce
  };
})();
