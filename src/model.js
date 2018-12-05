import deepCopy from 'deep-copy';
import Publisher from './publisher';
import mergeSettings from './merge-settings';

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
    this._publish('update', deepCopy(this._state));
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
}
