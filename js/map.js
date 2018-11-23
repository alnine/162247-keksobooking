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
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner']
var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
]
var PIN_WIDTH = 50;
var MAP_WIDTH = document.querySelector('.map').clientWidth;

function getRandomIntegerFromInterval(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

function getRandomElementFromArray(arr) {
  return arr[getRandomIntegerFromInterval(0, arr.length - 1)];
}
