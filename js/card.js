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

  function placeCapacityContent(parent, rooms, guests) {
    var element = parent.querySelector('.popup__text--capacity');
    element.textContent = rooms + ' комнаты для ' + guests + ' гостей';
  }

  function placeTimeContent(parent, entry, exit) {
    var element = parent.querySelector('.popup__text--time');
    element.textContent = 'Заезд после ' + entry + ', выезд до ' + exit;
  }

  function removeCapacitiItem(parent) {
    var element = parent.querySelector('.popup__text--capacity');
    if (element) {
      element.remove();
    }
  }

  function removeTimeItem(parent) {
    var element = parent.querySelector('.popup__text--time');
    if (element) {
      element.remove();
    }
  }

  var placeContent = {
    title: function (parent, content) {
      var element = parent.querySelector('.popup__title');
      element.textContent = content;
    },
    address: function (parent, content) {
      var element = parent.querySelector('.popup__text--address');
      element.textContent = content;
    },
    price: function (parent, content) {
      var element = parent.querySelector('.popup__text--price');
      element.textContent = content + '₽/ночь';
    },
    type: function (parent, content) {
      var element = parent.querySelector('.popup__type');
      element.textContent = TypesLabel[content.toUpperCase()];
    },
    description: function (parent, content) {
      var element = parent.querySelector('.popup__description');
      element.textContent = content;
    },
    features: function (parent, content) {
      var element = parent.querySelector('.popup__features');
      element.innerHTML = '';
      element.appendChild(getFeaturesLayout(content));
    },
    photos: function (parent, content) {
      var element = parent.querySelector('.popup__photos');
      var template = element.querySelector('img');
      element.innerHTML = '';
      element.appendChild(getPhotosLayout(content, template));
    },
    rooms: placeCapacityContent,
    guests: placeCapacityContent,
    checkin: placeTimeContent,
    checkout: placeTimeContent
  };

  var removeItem = {
    title: function (parent) {
      parent.querySelector('.popup__title').remove();
    },
    address: function (parent) {
      parent.querySelector('.popup__text--address').remove();
    },
    price: function (parent) {
      parent.querySelector('.popup__text--price').remove();
    },
    type: function (parent) {
      parent.querySelector('.popup__type').remove();
    },
    description: function (parent) {
      parent.querySelector('.popup__description').remove();
    },
    features: function (parent) {
      parent.querySelector('.popup__features').remove();
    },
    photos: function (parent) {
      parent.querySelector('.popup__photos').remove();
    },
    rooms: removeCapacitiItem,
    guests: removeCapacitiItem,
    checkin: removeTimeItem,
    checkout: removeTimeItem
  };

  function getLayout(data) {
    var layout = templateElement.cloneNode(true);
    var closeButton = layout.querySelector('.popup__close');
    var isTimeChange = false;
    var isCapacityChange = false;

    layout.querySelector('.popup__avatar').src = data.author.avatar;

    Object.keys(data.offer).forEach(function (key) {
      var value = data.offer[key];

      if (Array.isArray(value) && value.length > 0) {
        placeContent[key](layout, data.offer[key]);
      } else if ((key === 'checkin' || key === 'checkout') && data.offer['checkin'] && data.offer['checkout']) {
        if (!isTimeChange) {
          placeContent[key](layout, data.offer['checkin'], data.offer['checkout']);
          isTimeChange = true;
        }
      } else if ((key === 'rooms' || key === 'guests') && data.offer['rooms'] && data.offer['guests']) {
        if (!isCapacityChange) {
          placeContent[key](layout, data.offer['rooms'], data.offer['guests']);
          isCapacityChange = true;
        }
      } else if (value) {
        placeContent[key](layout, data.offer[key]);
      } else {
        removeItem[key](layout);
      }
    });

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
