// eslint-disable-next-line
import $ from 'jquery';
import '../range-slider-plugin';

$('body').append('<div>block</div>').rangeSlider({});

$.fn.rangeSlider.defaults = {
  min: 0,
  max: 2,
  step: 1.4,
  orientation: 'h'
};
