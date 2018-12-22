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
  var adFormSubmit = adForm.querySelector('.ad-form__submit');
  var adFormReset = adForm.querySelector('.ad-form__reset');
  var formFieldsets = adForm.querySelectorAll('fieldset');
  var formAddressField = adForm.querySelector('#address');
  var adFormRoomSelect = adForm.querySelector('#room_number');
  var adFormCapasitySelect = adForm.querySelector('#capacity');
  var adFormPriceField = adForm.querySelector('#price');
  var adFormTypeSelect = adForm.querySelector('#type');
  var adFormTimeInSelect = adForm.querySelector('#timein');
  var adFormTimeOutSelect = adForm.querySelector('#timeout');

  function fillValueAddressField(coord) {
    formAddressField.value = coord.x + ', ' + coord.y;
  }

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

  function typeChangeHandler() {
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

  function submitClickHandler(evt) {
    if (!adForm.checkValidity()) {
      adForm.classList.add('ad-form--invalid');
    } else {
      evt.preventDefault();
      adForm.classList.remove('ad-form--invalid');
      window.backend.upload(new FormData(adForm), window.popup.successHandler, window.popup.errorHandler);
    }
  }

  function resetForm() {
    adForm.reset();
    window.map.deactivatePage();
    typeChangeHandler();
  }

  function resetClickHandler(evt) {
    evt.preventDefault();
    resetForm();
  }

  function activateForm() {
    adForm.classList.remove('ad-form--disabled');
    formFieldsets.forEach(function (field) {
      field.disabled = false;
    });
    adFormSubmit.addEventListener('click', submitClickHandler);
    adFormReset.addEventListener('click', resetClickHandler);
    adFormTypeSelect.addEventListener('change', typeChangeHandler);
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
    adFormSubmit.removeEventListener('click', submitClickHandler);
    adFormReset.removeEventListener('click', resetClickHandler);
    adFormTypeSelect.removeEventListener('change', typeChangeHandler);
    adFormRoomSelect.removeEventListener('change', roomSelectChangeHandler);
    adFormCapasitySelect.removeEventListener('change', roomSelectChangeHandler);
    adFormTimeInSelect.removeEventListener('change', timeInChangeHandler);
    adFormTimeOutSelect.removeEventListener('change', timeOutChangeHandler);
  }

  window.form = {
    activateForm: activateForm,
    deactivateForm: deactivateForm,
    resetForm: resetForm,
    fillValueAddressField: fillValueAddressField
  };

})();
