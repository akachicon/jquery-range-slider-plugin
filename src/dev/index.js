// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import './styles.scss';
import '../range-slider-plugin';

const $body = $('body');
const $rsContainers = $body.find('.range-slider-container');
const $rsControllers = $body.find('.range-slider-controller');
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

const bindNumberInput = ($rsContainer, rsDataField, $input) => {
  $rsContainer.on('change.range-slider', (e, data) => {
    $input.val(data[rsDataField]);
  });

  $input.on('change', () => {
    $rsContainer.rangeSlider('configure', {
      [rsDataField]: +$input.val()
    });
  });
};

const bindValuesInputs = ($rsContainer, $input1, $input2) => {
  $rsContainer.on('change.range-slider', (e, data) => {
    $input1.val(data.values[0]);
    $input2.val(data.values[1]);
  });

  $input1.on('change', () => {
    $rsContainer.rangeSlider('configure', {
      values: [+$input1.val(), null]
    });
  });
  $input2.on('change', () => {
    $rsContainer.rangeSlider('configure', {
      values: [null, +$input2.val()]
    });
  });
};

const bindCheckboxInput = ($rsContainer, rsDataField, $input) => {
  $input.on('change', () => {
    $rsContainer.rangeSlider('configure', {
      [rsDataField]: $input.prop('checked')
    });
  });
};

const bindRadioInput = ($rsContainer, rsDataField, $input) => {
  $input.on('click', () => {
    if ($input.is(':checked')) {
      $rsContainer.rangeSlider('configure', {
        [rsDataField]: $input.val()
      });
    }
  });
};

const bindController = ($rsContainer, $rsController) => {
  const state = $rsContainer.rangeSlider('state')[0];

  [
    'min',
    'max',
    'step',
    'value'
  ].forEach((inputName) => {
    bindNumberInput(
      $rsContainer,
      inputName,
      $rsController.find(`input[name=${inputName}]`)
    );
  });

  bindValuesInputs(
    $rsContainer,
    $rsController.find('input[name=range-value1]'),
    $rsController.find('input[name=range-value2]')
  );

  [
    'hint',
    'range'
  ].forEach((inputName) => {
    const $input = $rsController.find(`input[name=${inputName}]`);

    $input.prop('checked', state[inputName]);
    bindCheckboxInput($rsContainer, inputName, $input);
  });

  $rsController.find('input[name=orientation]').each(
    (idx, input) => {
      const $input = $(input);

      $input.prop('checked', state.orientation === $input.val());
      bindRadioInput($rsContainer, 'orientation', $input);
    }
  );

  $rsContainer.rangeSlider('configure', {}); // trigger empty update to obtain initial values
};

const createPreview = (index) => {
  const $rsContainer = $rsContainers.eq(index);
  const $rsController = $rsControllers.eq(index);

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
