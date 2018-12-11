'use strict';

(function () {

  var GuestPerRoom = {
    ROOM_1: ['1'],
    ROOM_2: ['1', '2'],
    ROOM_3: ['1', '2', '3'],
    ROOM_100: ['0']
  };

  var GuestErrorMessage = {
    ROOM_1: 'Мало места',
    ROOM_2: 'Мало места',
    ROOM_3: 'Мало места',
    ROOM_100: 'Не для гостей'
  };

  var MinPriceHousing = {
    BUNGALO: 0,
    FLAT: 1000,
    HOUSE: 5000,
    PALACE: 10000
  };

  var adForm = document.querySelector('.ad-form');

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

  adFormRoomSelect.addEventListener('change', roomSelectChangeHandler);
  adFormCapasitySelect.addEventListener('change', roomSelectChangeHandler);

  adFormTypeSelect.addEventListener('change', function () {
    var key = adFormTypeSelect.value.toUpperCase();
    adFormPriceField.min = MinPriceHousing[key];
    adFormPriceField.placeholder = MinPriceHousing[key];
  });

  adFormTimeInSelect.addEventListener('change', function () {
    var timeSelect = adFormTimeInSelect.value;
    adFormTimeOutSelect.value = timeSelect;
  });

  adFormTimeOutSelect.addEventListener('change', function () {
    var timeSelect = adFormTimeOutSelect.value;
    adFormTimeInSelect.value = timeSelect;
  });

})();
