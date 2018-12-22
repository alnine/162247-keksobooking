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

  function getFeaturesLayout(features) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < features.length; i++) {
      var featuresItem = document.createElement('li');
      featuresItem.className = 'popup__feature popup__feature--' + features[i];
      fragment.appendChild(featuresItem);
    }
    return fragment;
  }

  function getPhotosLayout(photos, template) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < photos.length; i++) {
      var photosItem = template.cloneNode();
      photosItem.src = photos[i];
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
      var activePin = map.querySelector('.map__pin--active');
      activePin.classList.remove('map__pin--active');
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

    if (data.offer.title) {
      offerCardItem.querySelector('.popup__title').textContent = data.offer.title;
    } else {
      offerCardItem.removeChild(offerCardItem.querySelector('.popup__title'));
    }

    if (data.offer.address) {
      offerCardItem.querySelector('.popup__text--address').textContent = data.offer.address;
    } else {
      offerCardItem.removeChild(offerCardItem.querySelector('.popup__text--address'));
    }

    if (data.offer.price) {
      offerCardItem.querySelector('.popup__text--price').textContent = data.offer.price + '₽/ночь';
    } else {
      offerCardItem.removeChild(offerCardItem.querySelector('.popup__text--price'));
    }

    if (data.offer.type) {
      offerCardItem.querySelector('.popup__type').textContent = TypesLabel[data.offer.type];
    } else {
      offerCardItem.removeChild(offerCardItem.querySelector('.popup__type'));
    }

    if (data.offer.rooms && data.offer.guests) {
      offerCardItem.querySelector('.popup__text--capacity').textContent = data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей';
    } else {
      offerCardItem.removeChild(offerCardItem.querySelector('.popup__text--capacity'));
    }

    if (data.offer.checkin && data.offer.checkout) {
      offerCardItem.querySelector('.popup__text--time').textContent = 'Заезд после ' + data.offer.checkin + ', выезд до ' + data.offer.checkout;
    } else {
      offerCardItem.removeChild(offerCardItem.querySelector('.popup__text--time'));
    }

    if (data.offer.features) {
      featuresList.innerHTML = '';
      featuresList.appendChild(getFeaturesLayout(data.offer.features));
    } else {
      offerCardItem.removeChild(featuresList);
    }

    if (data.offer.description) {
      offerCardItem.querySelector('.popup__description').textContent = data.offer.description;
    } else {
      offerCardItem.removeChild(offerCardItem.querySelector('.popup__description'));
    }

    if (data.offer.photos) {
      photosList.innerHTML = '';
      photosList.appendChild(getPhotosLayout(data.offer.photos, photoTemplate));
    } else {
      offerCardItem.removeChild(photosList);
    }

    if (data.author.avatar) {
      offerCardItem.querySelector('.popup__avatar').src = data.author.avatar;
    } else {
      offerCardItem.removeChild(offerCardItem.querySelector('.popup__avatar'));
    }

    return offerCardItem;
  }

  window.card = {
    offerCardEscHandler: offerCardEscHandler,
    closeOfferCard: closeOfferCard,
    getOfferCardLayout: getOfferCardLayout
  };
})();
