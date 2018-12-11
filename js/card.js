'use strict';

(function () {

  var TypesLabel = {
    PALACE: 'Дворец',
    FLAT: 'Квартира',
    HOUSE: 'Дом',
    BUNGALO: 'Бунгало'
  };

  var map = document.querySelector('.map');

  var offerCardTemplate = document.querySelector('#card')
                        .content
                        .querySelector('.map__card');

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

  function offerCardEscHandler(evt) {
    window.util.isEscEvent(evt, closeOfferCard);
  }

  function closeOfferCard() {
    var offerCard = map.querySelector('.map__card.popup');
    if (offerCard) {
      map.removeChild(offerCard);
      document.removeEventListener('keydown', offerCardEscHandler);
    }
  }

  function getOfferCardLayout(data) {
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

  window.card = {
    offerCardEscHandler: offerCardEscHandler,
    closeOfferCard: closeOfferCard,
    getOfferCardLayout: getOfferCardLayout
  };
})();
