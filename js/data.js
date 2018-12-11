'use strict';

(function () {

  var TITLES = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ];

  var TYPES = ['PALACE', 'FLAT', 'HOUSE', 'BUNGALO'];
  var TIMEFRAMES = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

  var PHOTOS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];

  var LIMIT_Y_MIN = 130;
  var LIMIT_Y_MAX = 630;
  var PIN_WIDTH = 50;
  var mapWidth = document.querySelector('.map').clientWidth;

  function createDataOffer(count) {
    var locationX = window.util.getRandomIntegerFromInterval(PIN_WIDTH / 2, mapWidth - PIN_WIDTH / 2);
    var locationY = window.util.getRandomIntegerFromInterval(LIMIT_Y_MIN, LIMIT_Y_MAX);

    var data = {
      'author': {
        'avatar': 'img/avatars/user' + (count + 1 < 10 ? '0' + (count + 1) : count + 1) + '.png'
      },

      'offer': {
        'title': TITLES[count],
        'address': locationX + ', ' + locationY,
        'price': window.util.getRandomIntegerFromInterval(1000, 1000000),
        'type': window.util.getRandomElementFromArray(TYPES),
        'rooms': window.util.getRandomIntegerFromInterval(1, 5),
        'guests': window.util.getRandomIntegerFromInterval(1, 8),
        'checkin': window.util.getRandomElementFromArray(TIMEFRAMES),
        'checkout': window.util.getRandomElementFromArray(TIMEFRAMES),
        'features': FEATURES.slice(window.util.getRandomIntegerFromInterval(-(FEATURES.length - 1), FEATURES.length - 1)),
        'description': '',
        'photos': PHOTOS
      },

      'location': {
        'x': locationX,
        'y': locationY
      }
    };

    return data;
  }

  function getData(count) {
    var offers = [];
    for (var i = 0; i < count; i++) {
      offers.push(createDataOffer(i));
    }
    return offers;
  }

  window.data = getData;

})();
