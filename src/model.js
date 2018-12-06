import Publisher from './publisher';
import mergeSettings from './merge-settings';

// When a Model instance exposes its state to the outside somehow
// it performs shallow copy of the state. In conjunction with the convention
// that refiners return completely new data it's not possible for consumers
// to get unexpected change of the obtained state. But the consumers still can
// change the state from the outside, so there is another convention:
// they can use that state in readonly mode (and be sure that data will not change).

// When merging new state data into an existing state object there also is
// another benefit from shallow copy approach: consumers can detect changes
// in objects by strict equality check.

export default class Model extends Publisher {
  constructor(options) {
    super();

    this._state = mergeSettings(options, {
      min: 0,
      max: 10,
      step: 1,
      range: false,
      hint: false,
      orientation: 'h',
      value: 0,
      values: [0, 10],
      marks: {},
      enabled: true
    });
  }

  update(options = {}) {
    if (!this._state.enabled) return;

    this._state = mergeSettings(options, this._state);
    this._publish('update', { ...this._state });
  }

  updateValuePortion(fraction) {
    const { _state } = this._state;
    const calculateValue = (multiplier) => {
      if (typeof multiplier !== 'number') {
        return;
      }

      return _state.min + (_state.max - _state.min) * multiplier;
    };

    if (fraction instanceof Array) {
      this.update({
        values: [
          calculateValue(fraction[0]),
          calculateValue(fraction[1]),
        ]
      });

      return;
    }

    this.update({
      value: calculateValue(fraction)
    });
  }

  enable() {
    if (this._state.enabled) return;

    this._state.enabled = true;
    this._publish('enabled');
  }

  disable() {
    if (!this._state.enabled) return;

    this._state.enabled = false;
    this._publish('disabled');
  }

  destroy() {
    this._publish('destroyed');
  }

  getState() {
    return { ...this._state };
  }
}
