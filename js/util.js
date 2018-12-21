'use strict';

(function () {

  var ESC_KEYCODE = 27;
  var DEBOUNCE_INTERVAL = 500;
  var lastTimeout;

  function isEscEvent(evt, callback) {
    if (evt.keyCode === ESC_KEYCODE) {
      callback();
    }
  }

  function debounce(callback) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(callback, DEBOUNCE_INTERVAL);
  }

  window.util = {
    isEscEvent: isEscEvent,
    debounce: debounce
  };
})();
