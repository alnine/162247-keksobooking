
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

  function messageEscHandler(evt) {
    window.util.isEscEvent(evt, close);
  }

  function messageClickHandler() {
    close();
  }

  function closeButtonClickHandler(evt) {
    evt.stopPropagation();
    close();
  }

  function close() {
    var element = mainBlock.querySelector('.success') || mainBlock.querySelector('.error');
    if (element.className === 'error') {
      isError = false;
      window.map.deactivatePage();
    }
    mainBlock.removeChild(element);
    document.removeEventListener('keydown', messageEscHandler);
  }

  function successHandler() {
    var notice = successTemplate.cloneNode(true);
    mainBlock.appendChild(notice);
    document.addEventListener('keydown', messageEscHandler);
    notice.addEventListener('click', messageClickHandler);
    window.form.discard();
  }

  function errorHandler(error) {
    if (!isError) {
      isError = true;
      var notice = errorTemplate.cloneNode(true);
      var closeButton = notice.querySelector('.error__button');
      var messageElement = notice.querySelector('.error__message');
      messageElement.textContent = messageElement.textContent + '\r\n' + error;
      messageElement.style.whiteSpace = 'pre';
      mainBlock.appendChild(notice);
      document.addEventListener('keydown', messageEscHandler);
      notice.addEventListener('click', messageClickHandler);
      closeButton.addEventListener('click', closeButtonClickHandler);
    }
  }

  window.popup = {
    successHandler: successHandler,
    errorHandler: errorHandler
  };

})();
