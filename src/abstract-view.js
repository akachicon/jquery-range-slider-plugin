// eslint-disable-next-line import/no-extraneous-dependencies
import Publisher from './publisher';

export default class AbstractView extends Publisher {
  constructor(model) {
    super();

    const bindings = {
      globalUpdate: this.onGlobalUpdate,
      valueUpdate: this.onValueUpdate,
      valuesUpdate: this.onValuesUpdate,
      marksUpdate: this.onMarksUpdate,
      hintOn: this.onHintOn,
      hintOff: this.onHintOff,
      enabled: this.onEnabled,
      disabled: this.onDisabled,
      destroyed: this._onDestroyed
    };

    Object.keys(bindings).forEach((event) => {
      if (!bindings[event]) return;

      this._unsubscriptionList = {
        [event]: model.subscribe(event, bindings[event].bind(this))
      };
    });

    this.getState = () => (
      model.getState()
    );
  }

  _removeAllSubscriptions() {
    Object.keys(this._unsubscriptionList).forEach(
      unsubscribe => unsubscribe()
    );
  }

  _destroy() {
    this._removeAllSubscriptions();
  }

  _onDestroyed() {
    this._destroy();
    if (this.destroy) {
      this.destroy();
    }
  }

  /*

  onGlobalUpdate(data) {}

  onValueUpdate(value) {}

  onValuesUpdate(values) {}

  onMarksUpdate(marks) {}

  onHintOn() {}

  onHintOff() {}

  onEnabled() {}

  onDisabled() {}

  destroy() {}

  */
}
