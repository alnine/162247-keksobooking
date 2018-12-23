
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

  function escHandler(evt) {
    window.util.isEscEvent(evt, close);
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
    document.removeEventListener('keydown', escHandler);
  }

  function successHandler() {
    var item = successTemplate.cloneNode(true);
    mainBlock.appendChild(item);
    document.addEventListener('keydown', escHandler);
    item.addEventListener('click', close);
    window.form.discard();
  }

  function errorHandler(error) {
    if (!isError) {
      isError = true;
      var item = errorTemplate.cloneNode(true);
      var closeButton = item.querySelector('.error__button');
      var messageElement = item.querySelector('.error__message');
      messageElement.textContent = messageElement.textContent + '\r\n' + error;
      messageElement.style.whiteSpace = 'pre';
      mainBlock.appendChild(item);
      document.addEventListener('keydown', escHandler);
      item.addEventListener('click', close);
      closeButton.addEventListener('click', closeButtonClickHandler);
    }
  }

  window.popup = {
    successHandler: successHandler,
    errorHandler: errorHandler
  };

})();
