'use strict';

(function () {

  var SUCCESS_STATE_CODE = 200;
  var REQUEST_TIMEOUT = 10000;
  var REPSONSE_TYPE = 'json';
  var URL_LOAD = 'https://js.dump.academy/keksobooking/data';
  var URL_UPLOAD = 'https://js.dump.academy/keksobooking';

  function createRequest(successHandler, errorHandler) {
    var request = new XMLHttpRequest();
    request.responseType = REPSONSE_TYPE;

    request.addEventListener('load', function () {
      if (request.status === SUCCESS_STATE_CODE) {
        successHandler(request.response);
      } else {
        errorHandler('Ошибка: ' + request.status + ' ' + request.statusText);
      }
    });

    request.addEventListener('error', function () {
      errorHandler('Ошибка соединения. Проверьте подключение');
    });

    request.addEventListener('timeout', function () {
      errorHandler('Сервер долго не отвечает. Повторите попытку');
    });

    request.timeout = REQUEST_TIMEOUT;

    return request;
  }

  function load(loadHandler, errorHandler) {
    var xhr = createRequest(loadHandler, errorHandler);
    xhr.open('GET', URL_LOAD);
    xhr.send();
  }

  function upload(data, loadHandler, errorHandler) {
    var xhr = createRequest(loadHandler, errorHandler);
    xhr.open('POST', URL_UPLOAD);
    xhr.send(data);
  }

  window.backend = {
    load: load,
    upload: upload
  };

})();
