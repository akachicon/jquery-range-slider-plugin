import Publisher from './publisher';
import mergeSettings from './merge-settings';

export default class Model extends Publisher {
  constructor(options) {
    super();

    this.state = options;
    this._defineStateAccessDescriptor();
  }

  _defineStateAccessDescriptor() {
    this._state = this.state;
    delete this.state;

    Object.defineProperty(this, 'state', {
      set(newState) {
        if (!this._state.enabled) return;

        this._state = newState;
      },

      get() {
        return this._state;
      }
    });
  }

  update(options = {}) {
    const { state, _publish } = this;

    this.state = mergeSettings(options, state);
    _publish('update', this.state); // TODO: check this.state.enabled
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
    return this.state;
  }
}
