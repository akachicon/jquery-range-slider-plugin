// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import Publisher from './publisher';
import refineIncomingDefaults from './defaults-refiners';
import * as refiners from './defaults-refiners/refiners';

export default class Model extends Publisher {
  constructor(defaults, options) {
    super();

    this.state = defaults; // we can use this because updateAll will perform deep copy
    this.updateAll(options);
    this._defineStateAccessDescriptors();

    this._updateStateField = this._updateStateField.bind(this); // TODO: consider 'bindThis' syntax
  }

  _defineStateAccessDescriptors() {
    this.__state = this.state;
    delete this.state;

    const that = this;

    const defineStatePropsDescriptors = (stateObject) => {
      Object.keys(stateObject).forEach(key => (
        Object.defineProperty(stateObject, key, {
          set(newVal) {
            if (key === 'enabled' && newVal) {
              that.__state.enabled = true;

              return;
            }
            if (!that.__state.enabled) return;

            that.__state[key] = newVal;
          },

          get() {
            return that.__state[key];
          }
        })
      ));
    };

    Object.defineProperty(that, 'state', {
      set(newState) {
        if (!that.__state.enabled) return;

        that.__state = $.extend({}, newState); // TODO: deep copy
        defineStatePropsDescriptors(newState);
        that._state = newState;
      },

      get() {
        return that._state;
      }
    });

    that._state = $.extend({}, that.__state); // TODO: deep copy
    defineStatePropsDescriptors(that._state);
  }

  _updateStateField(field, refiner, update) {
    const { state } = this;
    const newVal = refiner(
      {
        ...state,
        [field]: update
      }, state
    );

    if (newVal === null) return;

    state[field] = newVal[field];

    return true;
  }

  updateAll(options = {}) {
    const { state, _publish } = this;

    // TODO: switch to some lib instead of $.extend utility for production
    // deep copy to prevent changing of the defaults from the options object
    // e. g. for nested objects in the marks

    this.state = $.extend({}, {
      ...state,
      ...refineIncomingDefaults(options, state)
    });

    _publish('globalUpdate', this.getState());
  }

  updateValue(val) {
    const { state, _publish, _updateStateField } = this;
    const update = _updateStateField('value', refiners.value, val);

    if (!update) return;

    _publish('valueUpdate', state.value);
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

  enable() {
    this.state.enabled = true;
    this._publish('enabled');
  }

  disable() {
    this.state.enabled = false;
    this._publish('disabled');
  }

  destroy() {
    this._publish('destroyed');
  }

  getState() {
    return $.extend({}, this.state); // TODO: use immutable or deep copy
  }
}
