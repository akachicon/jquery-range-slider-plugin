// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import './styles.scss';
import '../range-slider-plugin';

const colors = [
  'lightgoldenrodyellow',
  'lightgreen',
  'lightyellow',
  'lightpink'
];

const settings = {
  0: {
    value: 0,
    values: [30, 70]
  },
  1: {
    step: 5,
    orientation: 'v'
  },
  2: {
    range: true
  },
  3: {
    values: [-1, 1],
    hint: false
  }
};

const testContainer = index => (
  $(`<div class="test-slider-container test-slider-container_${colors[index]}"></div>`)
);

const createSliders = (indicies) => {
  indicies.forEach((index) => {
    const container = testContainer(index);

    $('body').append(container);
    container.rangeSlider(settings[index]);
  });
};

$.fn.rangeSlider.defaults = {
  min: 0,
  max: 100
};

createSliders([0, 1]);

$.fn.rangeSlider.defaults = {
  min: -1,
  max: 1,
  step: 0.001,
  value: 0,
  values: [-0.5, 0.5],
  hint: true
};

createSliders([2, 3]);
