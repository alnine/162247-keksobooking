'use strict';

(function () {

  var TypesLabel = {
    PALACE: 'Дворец',
    FLAT: 'Квартира',
    HOUSE: 'Дом',
    BUNGALO: 'Бунгало'
  };

  var templateElement = document.querySelector('#card')
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

  function escHandler(evt) {
    window.util.isEscEvent(evt, close);
  }

  function close() {
    var offerCard = window.map.element.querySelector('.map__card.popup');
    if (offerCard) {
      var activePin = window.map.element.querySelector('.map__pin--active');
      activePin.classList.remove('map__pin--active');
      window.map.element.removeChild(offerCard);
      document.removeEventListener('keydown', escHandler);
    }
  }

  function getLayout(data) {
    var layoutItem = templateElement.cloneNode(true);
    var featuresList = layoutItem.querySelector('.popup__features');
    var photosList = layoutItem.querySelector('.popup__photos');
    var photoTemplate = photosList.querySelector('img');
    var closeButton = layoutItem.querySelector('.popup__close');

    closeButton.addEventListener('click', function () {
      close();
    });

    if (data.offer.title) {
      layoutItem.querySelector('.popup__title').textContent = data.offer.title;
    } else {
      layoutItem.removeChild(layoutItem.querySelector('.popup__title'));
    }

    if (data.offer.address) {
      layoutItem.querySelector('.popup__text--address').textContent = data.offer.address;
    } else {
      layoutItem.removeChild(layoutItem.querySelector('.popup__text--address'));
    }

    if (data.offer.price) {
      layoutItem.querySelector('.popup__text--price').textContent = data.offer.price + '₽/ночь';
    } else {
      layoutItem.removeChild(layoutItem.querySelector('.popup__text--price'));
    }

    if (data.offer.type) {
      layoutItem.querySelector('.popup__type').textContent = TypesLabel[data.offer.type];
    } else {
      layoutItem.removeChild(layoutItem.querySelector('.popup__type'));
    }

    if (data.offer.rooms && data.offer.guests) {
      layoutItem.querySelector('.popup__text--capacity').textContent = data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей';
    } else {
      layoutItem.removeChild(layoutItem.querySelector('.popup__text--capacity'));
    }

    if (data.offer.checkin && data.offer.checkout) {
      layoutItem.querySelector('.popup__text--time').textContent = 'Заезд после ' + data.offer.checkin + ', выезд до ' + data.offer.checkout;
    } else {
      layoutItem.removeChild(layoutItem.querySelector('.popup__text--time'));
    }

    if (data.offer.features) {
      featuresList.innerHTML = '';
      featuresList.appendChild(getFeaturesLayout(data.offer.features));
    } else {
      layoutItem.removeChild(featuresList);
    }

    if (data.offer.description) {
      layoutItem.querySelector('.popup__description').textContent = data.offer.description;
    } else {
      layoutItem.removeChild(layoutItem.querySelector('.popup__description'));
    }

    if (data.offer.photos) {
      photosList.innerHTML = '';
      photosList.appendChild(getPhotosLayout(data.offer.photos, photoTemplate));
    } else {
      layoutItem.removeChild(photosList);
    }

    if (data.author.avatar) {
      layoutItem.querySelector('.popup__avatar').src = data.author.avatar;
    } else {
      layoutItem.removeChild(layoutItem.querySelector('.popup__avatar'));
    }

    return layoutItem;
  }

  window.card = {
    escHandler: escHandler,
    close: close,
    getLayout: getLayout
  };
})();
