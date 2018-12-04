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
var TYPES = ['PALACE', 'FLAT', 'HOUSE', 'BUNGALO'];
var TypesLabel = {
  PALACE: 'Дворец',
  FLAT: 'Квартира',
  HOUSE: 'Дом',
  BUNGALO: 'Бунгало'
};
var GuestPerRoom = {
  ROOM_1: ['1'],
  ROOM_2: ['1', '2'],
  ROOM_3: ['1', '2', '3'],
  ROOM_100: ['0']
};
var MinPriceHousing = {
  BUNGALO: 0,
  FLAT: 1000,
  HOUSE: 5000,
  PALACE: 10000
};
var TIMEFRAMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var PIN_WIDTH = 50;
var ESC_KEYCODE = 27;
var mapWidth = document.querySelector('.map').clientWidth;
var map = document.querySelector('.map');
var mapPinsBlock = document.querySelector('.map__pins');
var pinMain = mapPinsBlock.querySelector('.map__pin--main');
var mapFilters = document.querySelector('.map__filters-container');
var adForm = document.querySelector('.ad-form');
var adFormFieldsets = adForm.querySelectorAll('fieldset');
var adFormAddressField = adForm.querySelector('#address');
var adFormRoomSelect = adForm.querySelector('#room_number');
var adFormCapasitySelect = adForm.querySelector('#capacity');
var adFormPriceField = adForm.querySelector('#price');
var adFormTypeSelect = adForm.querySelector('#type');

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

function getOfferCardLayout(data) {
  var offerCardTemplate = document.querySelector('#card')
                      .content
                      .querySelector('.map__card');
  var offerCardItem = offerCardTemplate.cloneNode(true);
  var featuresList = offerCardItem.querySelector('.popup__features');
  var photosList = offerCardItem.querySelector('.popup__photos');
  var photoTemplate = photosList.querySelector('img');
  var cardClose = offerCardItem.querySelector('.popup__close');

  cardClose.addEventListener('click', function () {
    closeOfferCard();
  });
  offerCardItem.querySelector('.popup__title').textContent = data.offer.title;
  offerCardItem.querySelector('.popup__text--address').textContent = data.offer.address;
  offerCardItem.querySelector('.popup__text--price').textContent = data.offer.price + '₽/ночь';
  offerCardItem.querySelector('.popup__type').textContent = TypesLabel[data.offer.type];
  offerCardItem.querySelector('.popup__text--capacity').textContent = data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей';
  offerCardItem.querySelector('.popup__text--time').textContent = 'Заезд после ' + data.offer.checkin + ', выезд до ' + data.offer.checkout;
  featuresList.innerHTML = '';
  featuresList.appendChild(getOfferFeatures(data.offer.features));
  offerCardItem.querySelector('.popup__description').textContent = data.offer.description;
  photosList.innerHTML = '';
  photosList.appendChild(getOfferPhotos(data.offer.photos, photoTemplate));
  offerCardItem.querySelector('.popup__avatar').src = data.author.avatar;

  return offerCardItem;
}

function closeOfferCard() {
  var offerCard = map.querySelector('.map__card.popup');
  if (offerCard) {
    map.removeChild(offerCard);
    document.removeEventListener('keydown', offerCardEscHandler);
  }
}

function offerCardEscHandler(evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeOfferCard();
  }
}

function openOfferCard(data) {
  closeOfferCard();
  map.insertBefore(getOfferCardLayout(data), mapFilters);
  document.addEventListener('keydown', offerCardEscHandler);
}

function getPinItemLayout(data) {
  var pinTemplate = document.querySelector('#pin')
                      .content
                      .querySelector('.map__pin');
  var pinItem = pinTemplate.cloneNode(true);
  pinItem.style.cssText = 'left: ' + data.location.x + 'px; '
                         + 'top: ' + data.location.y + 'px;';
  pinItem.querySelector('img').src = data.author.avatar;
  pinItem.querySelector('img').alt = data.offer.title;
  pinItem.addEventListener('click', function () {
    openOfferCard(data);
  });
  return pinItem;
}

function renderPins(list) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < list.length; i++) {
    var pin = getPinItemLayout(list[i]);
    fragment.appendChild(pin);
  }
  return fragment;
}

function activatedMainPage() {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  for (var i = 0; i < adFormFieldsets.length; i++) {
    adFormFieldsets[i].disabled = false;
  }
}

function getObjectOfPinCoordinates(pinEl, isTailCoord) {
  var pinX = Math.floor(pinEl.offsetLeft + pinEl.clientWidth / 2);
  var pinY = Math.floor(pinEl.offsetTop + pinEl.clientHeight / 2);
  if (isTailCoord) {
    pinY = Math.floor(pinEl.offsetTop + pinEl.clientHeight);
  }
  return {x: pinX, y: pinY};
}

function fillValueAddressField(el, hasTail) {
  var pinCoord = getObjectOfPinCoordinates(el, hasTail);
  adFormAddressField.value = pinCoord.x + ', ' + pinCoord.y;
}

var offers = getOffers(8);
var pins = renderPins(offers);

function roomSelectChangeHandler() {
  var key = 'ROOM_' + adFormRoomSelect.value;
  var value = adFormCapasitySelect.value;
  if (key === 'ROOM_100' && value !== '0') {
    adFormCapasitySelect.setCustomValidity('Помещение не для гостей');
  } else if (GuestPerRoom[key].indexOf(value) < 0) {
    adFormCapasitySelect.setCustomValidity('Все не поместятся');
  } else {
    adFormCapasitySelect.setCustomValidity('');
  }
}

function pinMainMouseUpHandler(evt) {
  activatedMainPage();
  mapPinsBlock.appendChild(pins);
  fillValueAddressField(evt.currentTarget, true);
  adFormRoomSelect.addEventListener('change', roomSelectChangeHandler);
  adFormCapasitySelect.addEventListener('change', roomSelectChangeHandler);
  pinMain.removeEventListener('mouseup', pinMainMouseUpHandler);
}

for (var i = 0; i < adFormFieldsets.length; i++) {
  adFormFieldsets[i].disabled = true;
}

fillValueAddressField(pinMain, false);
pinMain.addEventListener('mouseup', pinMainMouseUpHandler);

adFormTypeSelect.addEventListener('change', function () {
  var key = adFormTypeSelect.value.toUpperCase();
  adFormPriceField.min = MinPriceHousing[key];
  adFormPriceField.placeholder = MinPriceHousing[key];
});
