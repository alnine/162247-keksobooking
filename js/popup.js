
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

  function documentEscKeyDownHandler(evt) {
    window.util.isEscEvent(evt, close);
  }

  function popupClickHandler() {
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
    document.removeEventListener('keydown', documentEscKeyDownHandler);
  }

  function successHandler() {
    var notice = successTemplate.cloneNode(true);
    mainBlock.appendChild(notice);
    document.addEventListener('keydown', documentEscKeyDownHandler);
    notice.addEventListener('click', popupClickHandler);
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
      document.addEventListener('keydown', documentEscKeyDownHandler);
      notice.addEventListener('click', popupClickHandler);
      closeButton.addEventListener('click', closeButtonClickHandler);
    }
  }

  window.popup = {
    successHandler: successHandler,
    errorHandler: errorHandler
  };

})();
