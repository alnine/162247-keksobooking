
'use strict';

(function () {

  var mainBlock = document.querySelector('main');
  var successTemplate = document.querySelector('#success')
                        .content
                        .querySelector('.success');
  var errorTemplate = document.querySelector('#error')
                        .content
                        .querySelector('.error');
  var isError = false;

  function popUpEscHandler(evt) {
    window.util.isEscEvent(evt, closePopUp);
  }

  function closeButtonClickHandler(evt) {
    evt.stopPropagation();
    closePopUp();
  }

  function closePopUp() {
    var popup = mainBlock.querySelector('.success') || mainBlock.querySelector('.error');
    if (popup.className === 'error') {
      isError = false;
      window.map.deactivatePage();
    }
    mainBlock.removeChild(popup);
    document.removeEventListener('keydown', popUpEscHandler);
  }

  function successHandler() {
    var popup = successTemplate.cloneNode(true);
    mainBlock.appendChild(popup);
    document.addEventListener('keydown', popUpEscHandler);
    popup.addEventListener('click', closePopUp);
    window.form.discard();
  }

  function errorHandler(error) {
    if (!isError) {
      isError = true;
      var popup = errorTemplate.cloneNode(true);
      var popupCloseButton = popup.querySelector('.error__button');
      var popupMessage = popup.querySelector('.error__message');
      popupMessage.textContent = popupMessage.textContent + '\r\n' + error;
      popupMessage.style.whiteSpace = 'pre';
      mainBlock.appendChild(popup);
      document.addEventListener('keydown', popUpEscHandler);
      popup.addEventListener('click', closePopUp);
      popupCloseButton.addEventListener('click', closeButtonClickHandler);
    }
  }

  window.popup = {
    successHandler: successHandler,
    errorHandler: errorHandler
  };

})();
