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
var typesLabel = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};
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
  var locationX = getRandomIntegerFromInterval(PIN_WIDTH / 2, mapWidth - PIN_WIDTH / 2);
  var locationY = getRandomIntegerFromInterval(130, 630);

  var data = {
    'author': {
      'avatar': 'img/avatars/user' + (count + 1 < 10 ? '0' + (count + 1) : count + 1) + '.png'
    },

    'offer': {
      'title': TITLES[count],
      'address': locationX + ', ' + locationY,
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
      'x': locationX,
      'y': locationY
    }
  };

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

function getOfferCapacity(rooms, guests) {
  return rooms + ' комнаты для ' + guests + ' гостей';
}

function getOfferTimeFrame(checkin, checkout) {
  return 'Заезд после ' + checkin + ', выезд до ' + checkout;
}

function getOfferFeatures(data) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < data.length; i++) {
    var featuresItem = document.createElement('li');
    featuresItem.className = 'popup__feature popup__feature--' + data[i];
    fragment.appendChild(featuresItem);
  }
  return fragment;
}

function getOfferPhotos(data, template) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < data.length; i++) {
    var photosItem = template.cloneNode();
    photosItem.src = data[i];
    fragment.appendChild(photosItem);
  }
  return fragment;
}

function getOfferLayout(data) {
  var offerCardTemplate = document.querySelector('#card')
                      .content
                      .querySelector('.map__card');
  var offerCardItem = offerCardTemplate.cloneNode(true);
  var featuresList = offerCardItem.querySelector('.popup__features');
  var photosList = offerCardItem.querySelector('.popup__photos');
  var photoTemplate = photosList.querySelector('img');

  offerCardItem.querySelector('.popup__title').textContent = data.offer.title;
  offerCardItem.querySelector('.popup__text--address').textContent = data.offer.address;
  offerCardItem.querySelector('.popup__text--price').textContent = data.offer.price + '₽/ночь';
  offerCardItem.querySelector('.popup__type').textContent = typesLabel[data.offer.type];
  offerCardItem.querySelector('.popup__text--capacity').textContent = getOfferCapacity(data.offer.rooms, data.offer.guests);
  offerCardItem.querySelector('.popup__text--time').textContent = getOfferTimeFrame(data.offer.checkin, data.offer.checkout);
  featuresList.innerHTML = '';
  featuresList.appendChild(getOfferFeatures(data.offer.features));
  offerCardItem.querySelector('.popup__description').textContent = data.offer.description;
  photosList.innerHTML = '';
  photosList.appendChild(getOfferPhotos(data.offer.photos, photoTemplate));
  offerCardItem.querySelector('.popup__avatar').src = data.author.avatar;

  return offerCardItem;
}

var map = document.querySelector('.map');
var mapPinsBlock = document.querySelector('.map__pins');
var mapFilters = document.querySelector('.map__filters-container');
var offers = getOffers(8);
map.classList.remove('map--faded');
mapPinsBlock.appendChild(renderPins(offers));

map.insertBefore(getOfferLayout(offers[0]), mapFilters);
