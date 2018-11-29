// eslint-disable-next-line
import $ from 'jquery';
import '../range-slider-plugin';

$('body').append('<div>block</div>').rangeSlider({});

$.fn.rangeSlider.defaults = {
  min: 40,
  max: 60,
  step: 1.4,
  orientation: 'h',
  value: -1,
  values: [0, 100],
  marks: {
    50: 'yes',
    60: { super: 'svg' },
    101: 'excluded'
  }
};
