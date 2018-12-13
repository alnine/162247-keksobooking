'use strict';

(function () {

  var SUCCESS_STATE_CODE = 200;
  var URL_LOAD = 'https://js.dump.academy/keksobooking/data';
  var URL_UPLOAD = 'https://js.dump.academy/keksobooking';

  function load(onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_STATE_CODE) {
        onLoad(xhr.response);
      } else {
        onError('Ошибка: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Ошибка соединения. Проверьте подключение');
    });

    xhr.addEventListener('timeout', function () {
      onError('Сервер долго не отвечает. Повторите попытку');
    });

    xhr.timeout = 10000;

    xhr.open('GET', URL_LOAD);
    xhr.send();
  }

  function upload(data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_STATE_CODE) {
        onLoad();
      } else {
        onError('Ошибка: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Ошибка соединения. Проверьте подключение');
    });

    xhr.addEventListener('timeout', function () {
      onError('Сервер долго не отвечает. Повторите попытку');
    });

    xhr.timeout = 10000;

    xhr.open('POST', URL_UPLOAD);
    xhr.send();
  }

  window.backend = {
    load: load,
    upload: upload
  };

})();
