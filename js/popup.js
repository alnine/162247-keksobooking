
'use strict';

(function () {

  var mainBlock = document.querySelector('main');
  var successTemplate = document.querySelector('#success')
                        .content
                        .querySelector('.success');
  var errorTemplate = document.querySelector('#error')
                        .content
                        .querySelector('.error');

  function popUpEscHandler(evt) {
    window.util.isEscEvent(evt, closePopUp);
  }

  function closePopUp() {
    var popup = mainBlock.querySelector('.success') || mainBlock.querySelector('.error');
    if (popup) {
      mainBlock.removeChild(popup);
      document.removeEventListener('keydown', popUpEscHandler);
    }
  }

  function successHandler() {
    var popup = successTemplate.cloneNode(true);
    mainBlock.appendChild(popup);
    document.addEventListener('keydown', popUpEscHandler);
    popup.addEventListener('click', closePopUp);
    document.querySelector('form.ad-form').reset();
  }

  function errorHandler(error) {
    var popup = errorTemplate.cloneNode(true);
    var popupCloseButton = popup.querySelector('error__button');
    var popupMessage = popup.querySelector('.error__message');
    popupMessage.textContent = popupMessage.textContent + '\r\n' + error;
    popupMessage.style.whiteSpace = 'pre';
    mainBlock.appendChild(popup);
    document.addEventListener('keydown', popUpEscHandler);
    popup.addEventListener('click', closePopUp);
    popupCloseButton.addEventListener('click', closePopUp);
  }

  window.popup = {
    successHandler: successHandler,
    errorHandler: errorHandler
  };

})();
