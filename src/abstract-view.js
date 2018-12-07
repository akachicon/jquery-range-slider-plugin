// eslint-disable-next-line import/no-extraneous-dependencies
import Publisher from './publisher';

export default class AbstractView extends Publisher {
  constructor(model) {
    super();

    const bindings = {
      update: this._onUpdate,
      enabled: this._onEnabled,
      disabled: this._onDisabled,
      destroyed: this._onDestroy
    };

    Object.keys(bindings).forEach((event) => {
      if (!bindings[event]) return;

      this._unsubscribeList = {
        [event]: model.subscribe(event, bindings[event].bind(this))
      };
    });

    this.getModelState = () => ( // readonly
      model.getState()
    );
  }

  /*

  _onUpdate() {}

  _onEnabled() {}

  _onDisabled() {}

  _onDestroy() {}

  */
}
