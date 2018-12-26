
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
    var noticeElement = successTemplate.cloneNode(true);
    mainBlock.appendChild(noticeElement);
    document.addEventListener('keydown', documentEscKeyDownHandler);
    noticeElement.addEventListener('click', popupClickHandler);
    window.form.discard();
  }

  function errorHandler(error) {
    if (!isError) {
      isError = true;
      var noticeElement = errorTemplate.cloneNode(true);
      var closeButton = noticeElement.querySelector('.error__button');
      var messageElement = noticeElement.querySelector('.error__message');
      messageElement.textContent = messageElement.textContent + '\r\n' + error;
      messageElement.style.whiteSpace = 'pre';
      mainBlock.appendChild(noticeElement);
      document.addEventListener('keydown', documentEscKeyDownHandler);
      noticeElement.addEventListener('click', popupClickHandler);
      closeButton.addEventListener('click', closeButtonClickHandler);
    }
  }

  window.popup = {
    successHandler: successHandler,
    errorHandler: errorHandler
  };

})();
