import Model from './model';
import View from './view-refactor3';
import Controller from './controller';

export default class RangeSlider {
  constructor(options = {}, $root) {
    const model = new Model(options);
    const view = new View(model, $root, options);
    const controller = new Controller(model, view);

    model.subscribe('update', this._onChange.bind(this));

    Object.assign(this, {
      _model: model,
      _view: view,
      _controller: controller,
      _$root: $root
    });
  }

  _onChange(data) {
    this._$root.triggerHandler('change.range-slider', data);
  }

  configure(data) {
    this._controller.update(data);
  }

  enable() {
    this._controller.enable();
  }

  disable() {
    this._controller.disable();
  }

  state() {
    return this._controller.getState();
  }
}
