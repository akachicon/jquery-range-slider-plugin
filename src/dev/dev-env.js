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
    values: [30, 70]
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
    .append('<div class="range-slider-preview__range-slider-container"></div>')
    .append('<div class="range-slider-preview__range-slider-controller"></div>')
);

const genPreviewController = ($containerSection, $controllerSection) => {
  const input = label => (
    $('<div class="input-container">')
      .append(`<label class="input-container__label">${label}:</label>`)
      .append('<input type="number" class="input-container__input"/>')
  );

  $controllerSection.append(input('min'));
};

const createPreview = (index) => {
  const $previewHtml = genPreviewHtml(index);
  const $containerSection = $previewHtml.find('.range-slider-preview__range-slider-container');
  const $controllerSection = $previewHtml.find('.range-slider-preview__range-slider-controller');

  $('body').append($previewHtml);
  $containerSection.rangeSlider(settings[index]);

  genPreviewController($containerSection, $controllerSection);
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
