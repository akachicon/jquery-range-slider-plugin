// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import Publisher from './publisher';
import refineIncomingDefaults from './defaults-refiners';
import * as refiners from './defaults-refiners/refiners';

class Model extends Publisher {
  constructor(options) {
    super();

    const defaults = {
      min: 0,
      max: 100,
      step: 5,
      range: false,
      hint: false,
      orientation: 'h',
      value: 50,
      values: [30, 70],
      marks: {
        0: 'zero',
        // 60: { super: 'svg' },
        100: '100'
      }
    };

    // TODO: switch to some lib instead of $.extend utility for production
    this.state = $.extend({}, { // to prevent changing of the defaults from the options object
      ...defaults,
      ...refineIncomingDefaults(options, defaults)
    });
  }

  updateValue(val) {
    const { state, publish } = this;

    const { value: newVal } = refiners.value({
      value: val,
      min: state.min,
      max: state.max,
    }, state);

    publish('valueUpdate', newVal);
  }

  updateValues() {

  }

  updateValueWithStep() {

  }

  updateValuesWithStep() {

  }

  updateMarks() {

  }

  enableHint() {

  }

  disableHint() {

  }

  updateAll() {

  }

  enable() {

  }

  disable() {

  }

  getState() {
    return $.extend({}, this.state); // TODO: use immutable
  }
}

export default Model;
