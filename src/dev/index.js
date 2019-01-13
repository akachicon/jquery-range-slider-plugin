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

const bindMinMaxInputs = ($rsContainer, $rsController, rsDataField, $input) => {
  const dependantInputs = [];

  [
    'value',
    'range-value1',
    'range-value2'
  ].forEach((inputName) => {
    dependantInputs.push(
      $rsController.find(`input[name=${inputName}]`)
    );
  });

  const syncMin = (val) => {
    dependantInputs.forEach(($depInput) => {
      $depInput.prop('min', val);
    });
  };

  $input.on('change', () => {
    const inputVal = +$input.val();

    if (rsDataField === 'min') {
      syncMin(inputVal);
    }

    $rsContainer.rangeSlider('configure', {
      [rsDataField]: inputVal
    });
  });
};

const bindStepInput = ($rsContainer, $rsController, $input) => {
  const dependantInputs = [];

  [
    'value',
    'range-value1',
    'range-value2'
  ].forEach((inputName) => {
    dependantInputs.push(
      $rsController.find(`input[name=${inputName}]`)
    );
  });

  const syncStep = (val) => {
    dependantInputs.forEach(($depInput) => {
      $depInput.prop('step', val);
    });
  };

  $input.on('change', () => {
    $rsContainer.rangeSlider('configure', {
      step: +$input.val()
    });
    syncStep(+$input.val());
  });
};

const bindValuesInputs = (
  $rsContainer,
  $valueInput,
  $rangeInput1,
  $rangeInput2
) => {
  $rsContainer.on('change.range-slider', (e, data) => {
    $valueInput.val(data.value);
    $rangeInput1.val(data.values[0]);
    $rangeInput2.val(data.values[1]);
  });

  $valueInput.on('change', () => {
    $rsContainer.rangeSlider('configure', {
      value: +$valueInput.val()
    });
  });
  $rangeInput1.on('change', () => {
    $rsContainer.rangeSlider('configure', {
      values: [+$rangeInput1.val(), null]
    });
  });
  $rangeInput2.on('change', () => {
    $rsContainer.rangeSlider('configure', {
      values: [null, +$rangeInput2.val()]
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

const bindContainerWidthInput = ($rsContainer, $input) => {
  $input.on('change', () => {
    if ($input.val() > 300 || $input.val() < 0) {
      return;
    }
    $rsContainer.width($input.val());
  });
};

const bindContainerHeightInput = ($rsContainer, $input) => {
  $input.on('change', () => {
    if ($input.val() > 300 || $input.val() < 0) {
      return;
    }
    $rsContainer.height($input.val());
  });
};

const bindController = ($rsContainer, $rsController) => {
  const state = $rsContainer.rangeSlider('state')[0];
  const $minInput = $rsController.find('input[name=min]');
  const $maxInput = $rsController.find('input[name=max]');

  [
    ['min', $minInput],
    ['max', $maxInput]
  ].forEach(([inputName, $input]) => {
    bindMinMaxInputs(
      $rsContainer,
      $rsController,
      inputName,
      $input
    );
  });
  $minInput.val(state.min);
  $maxInput.val(state.max);

  const $stepInput = $rsController.find('input[name=step]');

  bindStepInput(
    $rsContainer,
    $rsController,
    $stepInput
  );
  $stepInput.val(state.step);
  $stepInput.triggerHandler('change');

  bindValuesInputs(
    $rsContainer,
    $rsController.find('input[name=value]'),
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

  const $containerWidthInput = $rsController
    .find('input[name=element-width]');
  const $containerHeightInput = $rsController
    .find('input[name=element-height]');

  $containerWidthInput.val($rsContainer.width());
  $containerHeightInput.val($rsContainer.height());

  bindContainerWidthInput(
    $rsContainer,
    $containerWidthInput
  );
  bindContainerHeightInput(
    $rsContainer,
    $containerHeightInput
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
