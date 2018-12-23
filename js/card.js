'use strict';

(function () {

  var TypesLabel = {
    PALACE: 'Дворец',
    FLAT: 'Квартира',
    HOUSE: 'Дом',
    BUNGALO: 'Бунгало'
  };

  var elementPlace = document.querySelector('.map__filters-container');
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
    var popupElement = window.map.element.querySelector('.map__card.popup');
    if (popupElement) {
      var activePinElement = window.map.element.querySelector('.map__pin--active');
      activePinElement.classList.remove('map__pin--active');
      window.map.element.removeChild(popupElement);
      document.removeEventListener('keydown', escHandler);
    }
  }

  function open(data) {
    close();
    window.map.element.insertBefore(window.card.getLayout(data), elementPlace);
    document.addEventListener('keydown', escHandler);
  }

  function fillLayout(element, data) {
    var featuresList = element.querySelector('.popup__features');
    var photosList = element.querySelector('.popup__photos');
    var photoTemplate = photosList.querySelector('img');

    element.querySelector('.popup__avatar').src = data.author.avatar;
    element.querySelector('.popup__title').textContent = data.offer.title;
    element.querySelector('.popup__text--address').textContent = data.offer.address;
    element.querySelector('.popup__text--price').textContent = data.offer.price + '₽/ночь';
    element.querySelector('.popup__type').textContent = TypesLabel[data.offer.type];
    element.querySelector('.popup__text--capacity').textContent = data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей';
    element.querySelector('.popup__text--time').textContent = 'Заезд после ' + data.offer.checkin + ', выезд до ' + data.offer.checkout;
    element.querySelector('.popup__description').textContent = data.offer.description;

    featuresList.innerHTML = '';
    featuresList.appendChild(getFeaturesLayout(data.offer.features));
    photosList.innerHTML = '';
    photosList.appendChild(getPhotosLayout(data.offer.photos, photoTemplate));
  }

  function getEmptyElementChilds(childs) {
    var emptyChilds = childs.filter(function (child, index) {
      if (index > 1 && child.innerHTML === '') {
        return true;
      }
      return false;
    });

    return emptyChilds;
  }

  function deleteEmptyElementChilds(parent) {
    var parentChilds = Array.from(parent.children);
    var emptyChilds = getEmptyElementChilds(parentChilds);
    emptyChilds.forEach(function (child) {
      parent.removeChild(child);
    });
  }

  function getLayout(data) {
    var layout = templateElement.cloneNode(true);
    var closeButton = layout.querySelector('.popup__close');

    fillLayout(layout, data);
    deleteEmptyElementChilds(layout);

    closeButton.addEventListener('click', function () {
      close();
    });

    return layout;
  }

  window.card = {
    open: open,
    close: close,
    getLayout: getLayout
  };
})();
