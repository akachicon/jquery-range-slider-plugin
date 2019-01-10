// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import './styles.scss';
import '../range-slider-plugin';

const colors = [
  'lightgoldenrodyellow',
  'whitesmoke',
  'lightyellow',
  'lightpink'
];

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

const genPreviewHtml = index => (
  $(`<div class="range-slider-preview range-slider-preview_${colors[index]}"></div>`)
    .append('<div class="range-slider-container"></div>')
    .append('<div class="range-slider-controller"></div>')
);

const genPreviewController = ($rsContainer, $rsController) => {
  const input = (label, type) => (
    $('<div class="range-slider-controller__input-container input-container">')
      .append(`<label class="input-container__label">${label}:</label>`)
      .append(`<input type="${type}" class="input-container__input"/>`)
  );

  const controller = {
    min: input('min', 'number'),
    max: input('max', 'number'),
    step: input('step', 'number'),
    value: input('value', 'number'),
    rangeValue1: input('range-value1', 'number'),
    rangeValue2: input('range-value2', 'number'),
    hint: input('hint', 'checkbox'),
    range: input('range', 'checkbox'),
  };

  Object.values(controller).forEach((input) => {
    $rsController.append(input);
  });
};

const createPreview = (index) => {
  const $previewHtml = genPreviewHtml(index);
  const $rsContainer = $previewHtml.find('.range-slider-container');
  const $rsController = $previewHtml.find('.range-slider-controller');

  $('body').append($previewHtml);
  $rsContainer.rangeSlider(settings[index]);

  genPreviewController($rsContainer, $rsController);
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
