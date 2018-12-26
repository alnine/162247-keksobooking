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

  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var AVATAR_DEFAULT = 'img/muffin-grey.svg';

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
  var avatarChooser = element.querySelector('#avatar');
  var avatarPreviewElement = element.querySelector('.ad-form-header__preview img');
  var photoContainer = element.querySelector('.ad-form__photo-container');
  var photoChooser = element.querySelector('#images');
  var photoPreviewElement = element.querySelector('.ad-form__photo');

  function isImage(fileName) {
    var result = FILE_TYPES.some(function (type) {
      return fileName.endsWith(type);
    });
    return result;
  }

  function avatarInputChangeHandler() {
    var file = avatarChooser.files[0];

    if (isImage(file.name.toLowerCase())) {
      window.util.setPreviewImg(file, avatarPreviewElement);
    }
  }

  function getImgTemlate() {
    var img = document.createElement('img');
    img.width = '70';
    img.height = '70';
    return img;
  }

  function photoInputChangeHandler() {
    var file = photoChooser.files[0];

    if (isImage(file.name.toLowerCase())) {
      var img = getImgTemlate();
      window.util.setPreviewImg(file, img);
      var preview = photoPreviewElement.cloneNode(true);
      preview.appendChild(img);
      photoContainer.insertBefore(preview, photoPreviewElement);
    }
  }

  function cleanPhoto() {
    var photoElements = element.querySelectorAll('.ad-form__photo');
    photoElements.forEach(function (photo) {
      if (photo.innerHTML !== '') {
        photoContainer.removeChild(photo);
      }
    });
  }

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
    avatarPreviewElement.src = AVATAR_DEFAULT;
    cleanPhoto();
  }

  function resetButtonClickHandler(evt) {
    evt.preventDefault();
    discard();
  }

  function disableFieldset(isDisable) {
    fieldsets.forEach(function (field) {
      field.disabled = isDisable;
    });
  }

  function activate() {
    element.classList.remove('ad-form--disabled');
    disableFieldset(false);
    submitButton.addEventListener('click', submitButtonClickHandler);
    resetButton.addEventListener('click', resetButtonClickHandler);
    typeSelect.addEventListener('change', typeChangeHandler);
    roomSelect.addEventListener('change', roomSelectChangeHandler);
    capasitySelect.addEventListener('change', roomSelectChangeHandler);
    timeInSelect.addEventListener('change', timeInChangeHandler);
    timeOutSelect.addEventListener('change', timeOutChangeHandler);
    avatarChooser.addEventListener('change', avatarInputChangeHandler);
    photoChooser.addEventListener('change', photoInputChangeHandler);
  }

  function deactivate() {
    element.classList.add('ad-form--disabled');
    disableFieldset(true);
    submitButton.removeEventListener('click', submitButtonClickHandler);
    resetButton.removeEventListener('click', resetButtonClickHandler);
    typeSelect.removeEventListener('change', typeChangeHandler);
    roomSelect.removeEventListener('change', roomSelectChangeHandler);
    capasitySelect.removeEventListener('change', roomSelectChangeHandler);
    timeInSelect.removeEventListener('change', timeInChangeHandler);
    timeOutSelect.removeEventListener('change', timeOutChangeHandler);
    avatarChooser.removeEventListener('change', avatarInputChangeHandler);
    photoChooser.removeEventListener('change', photoInputChangeHandler);
  }

  disableFieldset(true);

  window.form = {
    disableFieldset: disableFieldset,
    activate: activate,
    deactivate: deactivate,
    discard: discard,
    fillValueAddressField: fillValueAddressField
  };

})();
