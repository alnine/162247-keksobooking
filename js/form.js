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

  var adForm = document.querySelector('.ad-form');
  var formFieldsets = adForm.querySelectorAll('fieldset');

  var adFormRoomSelect = adForm.querySelector('#room_number');
  var adFormCapasitySelect = adForm.querySelector('#capacity');
  var adFormPriceField = adForm.querySelector('#price');
  var adFormTypeSelect = adForm.querySelector('#type');
  var adFormTimeInSelect = adForm.querySelector('#timein');
  var adFormTimeOutSelect = adForm.querySelector('#timeout');

  function roomSelectChangeHandler() {
    var guests = GuestPerRoom['ROOM_' + adFormRoomSelect.value];
    var errorMessage = GuestErrorMessage['ROOM_' + adFormRoomSelect.value];
    var isMatch = guests.includes(adFormCapasitySelect.value);
    if (isMatch) {
      adFormCapasitySelect.setCustomValidity('');
    } else {
      adFormCapasitySelect.setCustomValidity(errorMessage);
    }
  }

  function setMinPrice() {
    var key = adFormTypeSelect.value.toUpperCase();
    adFormPriceField.min = MinPriceHousing[key];
    adFormPriceField.placeholder = MinPriceHousing[key];
  }

  function timeInChangeHandler() {
    var timeSelect = adFormTimeInSelect.value;
    adFormTimeOutSelect.value = timeSelect;
  }

  function timeOutChangeHandler() {
    var timeSelect = adFormTimeOutSelect.value;
    adFormTimeInSelect.value = timeSelect;
  }

  function formSubmitHandler(evt) {
    evt.preventDefault();
    window.backend.upload(new FormData(adForm), window.popup.successHandler, window.popup.errorHandler);
  }

  function formResetHandler() {
    setTimeout(function () {
      window.map.deactivatePage();
      setMinPrice();
    }, 0);
  }

  function activateForm() {
    adForm.classList.remove('ad-form--disabled');
    formFieldsets.forEach(function (field) {
      field.disabled = false;
    });
    adForm.addEventListener('submit', formSubmitHandler);
    adForm.addEventListener('reset', formResetHandler);
    adFormTypeSelect.addEventListener('change', setMinPrice);
    adFormRoomSelect.addEventListener('change', roomSelectChangeHandler);
    adFormCapasitySelect.addEventListener('change', roomSelectChangeHandler);
    adFormTimeInSelect.addEventListener('change', timeInChangeHandler);
    adFormTimeOutSelect.addEventListener('change', timeOutChangeHandler);
  }

  function deactivateForm() {
    adForm.classList.add('ad-form--disabled');
    formFieldsets.forEach(function (field) {
      field.disabled = true;
    });
    adForm.removeEventListener('submit', formSubmitHandler);
    adForm.removeEventListener('reset', formResetHandler);
    adFormTypeSelect.removeEventListener('change', setMinPrice);
    adFormRoomSelect.removeEventListener('change', roomSelectChangeHandler);
    adFormCapasitySelect.removeEventListener('change', roomSelectChangeHandler);
    adFormTimeInSelect.removeEventListener('change', timeInChangeHandler);
    adFormTimeOutSelect.removeEventListener('change', timeOutChangeHandler);
  }

  window.form = {
    activateForm: activateForm,
    deactivateForm: deactivateForm
  };

})();
