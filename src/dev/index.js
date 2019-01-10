// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import './styles.scss';
import '../range-slider-plugin';

const $body = $('body');
const settings = {
  0: {
    value: 0,
    values: [30, 70],
  },
  1: {
    step: 15,
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

const bindController = ($rsContainer, $rsController) => {
  const controllerInputs = {};
  const controllerInputNames = [
    'min',
    'max',
    'step',
    'value',
    'range-value1',
    'range-value2',
    'hint',
    'range',
    'orientation',
    'element-width',
    'element-height'
  ];

  controllerInputNames.forEach((name) => {
    controllerInputs[name] = $rsController.find(`input[name=${name}]`);
  });
};

const createPreview = (index) => {
  const $rsContainer = $body.find('.range-slider-container').eq(index);
  const $rsController = $body.find('.range-slider-controller').eq(index);

  $rsContainer.rangeSlider(settings[index]);

  bindController($rsContainer, $rsController);
};

$.fn.rangeSlider.defaults = {
  min: 0,
  max: 100
};

createPreview(0);
createPreview(1);

$.fn.rangeSlider.defaults = {
  min: -1,
  max: 1,
  step: 0.001,
  value: 0,
  values: [-0.5, 0.5],
  hint: true
};

createPreview(2);
createPreview(3);
