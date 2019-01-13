import deepCopy from 'deep-copy';
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

    // We can reckon on fully correct options object to form initial state but we don't.
    // This way we ensure correctness of the state so it can be used by others as an initial
    // data.

    this._state = Model.mergeSettings(options, {
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
    if (!this._state.enabled
        || typeof options !== 'object') {
      return;
    }

    this._state = Model.mergeSettings(options, this._state);
    this._publish('update', { ...this._state });
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
    return deepCopy(this._state);
  }

  static isEqual(a, b) {
    return a === b;
  }
}

Model.mergeSettings = mergeSettings;
