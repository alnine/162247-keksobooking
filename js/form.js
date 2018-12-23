'use strict';

(function () {

  var GuestPerRoom = {
    ROOM_1: ['1'],
    ROOM_2: ['1', '2'],
    ROOM_3: ['1', '2', '3'],
    ROOM_100: ['0']
  };

  var GuestErrorMessage = {
    ROOM_1: 'Не более 1 гостя',
    ROOM_2: 'Не более 2 гостей',
    ROOM_3: 'Не более 3 гостей',
    ROOM_100: 'Не для гостей'
  };

  var MinPriceHousing = {
    BUNGALO: 0,
    FLAT: 1000,
    HOUSE: 5000,
    PALACE: 10000
  };

  var element = document.querySelector('.ad-form');
  var submitButton = element.querySelector('.ad-form__submit');
  var resetButton = element.querySelector('.ad-form__reset');
  var fieldsets = element.querySelectorAll('fieldset');
  var addressField = element.querySelector('#address');
  var roomSelect = element.querySelector('#room_number');
  var capasitySelect = element.querySelector('#capacity');
  var priceField = element.querySelector('#price');
  var typeSelect = element.querySelector('#type');
  var timeInSelect = element.querySelector('#timein');
  var timeOutSelect = element.querySelector('#timeout');

  function fillValueAddressField(coord) {
    addressField.value = coord.x + ', ' + coord.y;
  }

  function roomSelectChangeHandler() {
    var guests = GuestPerRoom['ROOM_' + roomSelect.value];
    var errorMessage = GuestErrorMessage['ROOM_' + roomSelect.value];
    var isMatch = guests.includes(capasitySelect.value);
    capasitySelect.setCustomValidity(isMatch ? '' : errorMessage);
  }

  function typeChangeHandler() {
    var key = typeSelect.value.toUpperCase();
    priceField.min = MinPriceHousing[key];
    priceField.placeholder = MinPriceHousing[key];
  }

  function timeInChangeHandler() {
    timeOutSelect.value = timeInSelect.value;
  }

  function timeOutChangeHandler() {
    timeInSelect.value = timeOutSelect.value;
  }

  function submitButtonClickHandler(evt) {
    if (!element.checkValidity()) {
      element.classList.add('ad-form--invalid');
    } else {
      evt.preventDefault();
      element.classList.remove('ad-form--invalid');
      window.backend.upload(new FormData(element), window.popup.successHandler, window.popup.errorHandler);
    }
  }

  function discard() {
    element.reset();
    window.map.deactivatePage();
    typeChangeHandler();
  }

  function resetButtonClickHandler(evt) {
    evt.preventDefault();
    discard();
  }

  function activate() {
    element.classList.remove('ad-form--disabled');
    fieldsets.forEach(function (field) {
      field.disabled = false;
    });
    submitButton.addEventListener('click', submitButtonClickHandler);
    resetButton.addEventListener('click', resetButtonClickHandler);
    typeSelect.addEventListener('change', typeChangeHandler);
    roomSelect.addEventListener('change', roomSelectChangeHandler);
    capasitySelect.addEventListener('change', roomSelectChangeHandler);
    timeInSelect.addEventListener('change', timeInChangeHandler);
    timeOutSelect.addEventListener('change', timeOutChangeHandler);
  }

  function deactivate() {
    element.classList.add('ad-form--disabled');
    fieldsets.forEach(function (field) {
      field.disabled = true;
    });
    submitButton.removeEventListener('click', submitButtonClickHandler);
    resetButton.removeEventListener('click', resetButtonClickHandler);
    typeSelect.removeEventListener('change', typeChangeHandler);
    roomSelect.removeEventListener('change', roomSelectChangeHandler);
    capasitySelect.removeEventListener('change', roomSelectChangeHandler);
    timeInSelect.removeEventListener('change', timeInChangeHandler);
    timeOutSelect.removeEventListener('change', timeOutChangeHandler);
  }

  window.form = {
    fieldsets: fieldsets,
    activate: activate,
    deactivate: deactivate,
    discard: discard,
    fillValueAddressField: fillValueAddressField
  };

})();
