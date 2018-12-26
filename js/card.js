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
      var featuresElement = document.createElement('li');
      featuresElement.className = 'popup__feature popup__feature--' + features[i];
      fragment.appendChild(featuresElement);
    }
    return fragment;
  }

  function getPhotosLayout(photos, template) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < photos.length; i++) {
      var photosElement = template.cloneNode();
      photosElement.src = photos[i];
      fragment.appendChild(photosElement);
    }
    return fragment;
  }

  function documentEscKeyDownHandler(evt) {
    window.util.isEscEvent(evt, close);
  }

  function close() {
    var popupElement = window.map.element.querySelector('.map__card.popup');
    if (popupElement) {
      var activePinElement = window.map.element.querySelector('.map__pin--active');
      activePinElement.classList.remove('map__pin--active');
      window.map.element.removeChild(popupElement);
      document.removeEventListener('keydown', documentEscKeyDownHandler);
    }
  }

  function open(data) {
    close();
    window.map.element.insertBefore(getLayout(data), elementPlace);
    document.addEventListener('keydown', documentEscKeyDownHandler);
  }

  function setCapacityContent(parent, rooms, guests) {
    var element = parent.querySelector('.popup__text--capacity');
    element.textContent = rooms + ' комнаты для ' + guests + ' гостей';
  }

  function setTimeContent(parent, entry, exit) {
    var element = parent.querySelector('.popup__text--time');
    element.textContent = 'Заезд после ' + entry + ', выезд до ' + exit;
  }

  function removeCapacityElement(parent) {
    var element = parent.querySelector('.popup__text--capacity');
    if (element) {
      element.remove();
    }
  }

  function removeTimeElement(parent) {
    var element = parent.querySelector('.popup__text--time');
    if (element) {
      element.remove();
    }
  }

  var placing = {
    setTitle: function (parent, content) {
      var element = parent.querySelector('.popup__title');
      element.textContent = content;
    },
    setAddress: function (parent, content) {
      var element = parent.querySelector('.popup__text--address');
      element.textContent = content;
    },
    setPrice: function (parent, content) {
      var element = parent.querySelector('.popup__text--price');
      element.textContent = content + '₽/ночь';
    },
    setType: function (parent, content) {
      var element = parent.querySelector('.popup__type');
      element.textContent = TypesLabel[content.toUpperCase()];
    },
    setDescription: function (parent, content) {
      var element = parent.querySelector('.popup__description');
      element.textContent = content;
    },
    setFeatures: function (parent, content) {
      var element = parent.querySelector('.popup__features');
      element.innerHTML = '';
      element.appendChild(getFeaturesLayout(content));
    },
    setPhotos: function (parent, content) {
      var element = parent.querySelector('.popup__photos');
      var template = element.querySelector('img');
      element.innerHTML = '';
      element.appendChild(getPhotosLayout(content, template));
    },
    setRooms: setCapacityContent,
    setGuests: setCapacityContent,
    setCheckin: setTimeContent,
    setCheckout: setTimeContent
  };

  var cleaning = {
    removeTitle: function (parent) {
      parent.querySelector('.popup__title').remove();
    },
    removeAddress: function (parent) {
      parent.querySelector('.popup__text--address').remove();
    },
    removePrice: function (parent) {
      parent.querySelector('.popup__text--price').remove();
    },
    removeType: function (parent) {
      parent.querySelector('.popup__type').remove();
    },
    removeDescription: function (parent) {
      parent.querySelector('.popup__description').remove();
    },
    removeFeatures: function (parent) {
      parent.querySelector('.popup__features').remove();
    },
    removePhotos: function (parent) {
      parent.querySelector('.popup__photos').remove();
    },
    removeRooms: removeCapacityElement,
    removeGuests: removeCapacityElement,
    removeCheckin: removeTimeElement,
    removeCheckout: removeTimeElement
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function getLayout(data) {
    var layout = templateElement.cloneNode(true);
    var closeButton = layout.querySelector('.popup__close');
    var isTimeChange = false;
    var isCapacityChange = false;

    layout.querySelector('.popup__avatar').src = data.author.avatar;

    Object.keys(data.offer).forEach(function (key) {
      var value = data.offer[key];

      if (Array.isArray(value) && value.length > 0) {
        placing['set' + capitalizeFirstLetter(key)](layout, data.offer[key]);
      } else if ((key === 'checkin' || key === 'checkout') && data.offer['checkin'] && data.offer['checkout']) {
        if (!isTimeChange) {
          placing['set' + capitalizeFirstLetter(key)](layout, data.offer['checkin'], data.offer['checkout']);
          isTimeChange = true;
        }
      } else if ((key === 'rooms' || key === 'guests') && data.offer['rooms'] && data.offer['guests']) {
        if (!isCapacityChange) {
          placing['set' + capitalizeFirstLetter(key)](layout, data.offer['rooms'], data.offer['guests']);
          isCapacityChange = true;
        }
      } else if (value) {
        placing['set' + capitalizeFirstLetter(key)](layout, data.offer[key]);
      } else {
        cleaning['remove' + capitalizeFirstLetter(key)](layout);
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
