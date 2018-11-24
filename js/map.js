'use strict';

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
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var TIMEFRAMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var PIN_WIDTH = 50;
var mapWidth = document.querySelector('.map').clientWidth;


function getRandomIntegerFromInterval(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

function getRandomElementFromArray(arr) {
  return arr[getRandomIntegerFromInterval(0, arr.length - 1)];
}

function createOffer(count) {
  var data = {
    'author': {
      'avatar': 'img/avatars/user' + (count + 1 < 10 ? '0' + (count + 1) : count + 1) + '.png'
    },

    'offer': {
      'title': TITLES[count],
      'address': '',
      'price': getRandomIntegerFromInterval(1000, 1000000),
      'type': getRandomElementFromArray(TYPES),
      'rooms': getRandomIntegerFromInterval(1, 5),
      'guests': getRandomIntegerFromInterval(1, 8),
      'checkin': getRandomElementFromArray(TIMEFRAMES),
      'checkout': getRandomElementFromArray(TIMEFRAMES),
      'features': FEATURES.slice(getRandomIntegerFromInterval(-(FEATURES.length - 1), FEATURES.length - 1)),
      'description': '',
      'photos': PHOTOS
    },

    'location': {
      'x': getRandomIntegerFromInterval(PIN_WIDTH / 2, mapWidth - PIN_WIDTH / 2),
      'y': getRandomIntegerFromInterval(130, 630)
    }
  };

  data.offer.address = data.location.x + ', ' + data.location.y;

  return data;
}

function getOffers(count) {
  var offers = [];
  for (var i = 0; i < count; i++) {
    offers.push(createOffer(i));
  }
  return offers;
}

function getPinLayout(data) {
  var pinTemplate = document.querySelector('#pin')
                      .content
                      .querySelector('.map__pin');
  var pinItem = pinTemplate.cloneNode(true);
  var styleAtrribute = 'left: ' + data.location.x + 'px; '
                      + 'top: ' + data.location.y + 'px;';
  pinItem.setAttribute('style', styleAtrribute);
  pinItem.querySelector('img').src = data.author.avatar;
  pinItem.querySelector('img').alt = data.offer.title;
  return pinItem;
}

function renderPins(list) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < list.length; i++) {
    var pin = getPinLayout(list[i]);
    fragment.appendChild(pin);
  }
  return fragment;
}

var map = document.querySelector('.map');
var mapPinsBlock = document.querySelector('.map__pins');
map.classList.remove('map--faded');
var offers = getOffers(8);
mapPinsBlock.appendChild(renderPins(offers));

