'use strict';

(function () {

  var SUCCESS_STATE_CODE = 200;
  var REQUEST_TIMEOUT = 10000;
  var REPSONSE_TYPE = 'json';
  var URL_LOAD = 'https://js.dump.academy/keksobooking/data';
  var URL_UPLOAD = 'https://js.dump.academy/keksobooking';

  function createRequest(success, error) {
    var request = new XMLHttpRequest();
    request.responseType = REPSONSE_TYPE;

    request.addEventListener('load', function () {
      if (request.status === SUCCESS_STATE_CODE) {
        success(request.response);
      } else {
        error('Ошибка: ' + request.status + ' ' + request.statusText);
      }
    });

    request.addEventListener('error', function () {
      error('Ошибка соединения. Проверьте подключение');
    });

    request.addEventListener('timeout', function () {
      error('Сервер долго не отвечает. Повторите попытку');
    });

    request.timeout = REQUEST_TIMEOUT;

    return request;
  }

  function load(onLoad, onError) {
    var xhr = createRequest(onLoad, onError);
    xhr.open('GET', URL_LOAD);
    xhr.send();
  }

  function upload(data, onLoad, onError) {
    var xhr = createRequest(onLoad, onError);
    xhr.open('POST', URL_UPLOAD);
    xhr.send(data);
  }

  window.backend = {
    load: load,
    upload: upload
  };

})();
