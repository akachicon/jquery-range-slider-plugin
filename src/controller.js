export default class Controller {
  constructor(model, view) {
    view.subscribe(
      'update',
      this.update.bind(this)
    );
    view.subscribe(
      'portionUpdate',
      this.updateWithValueAsPortion.bind(this)
    );

    this._model = model;
  }

  update(data) {
    this._model.update(data);
  }

  updateWithValueAsPortion(data) {
    const { value, values } = data;
    const { min, max } = this._model.getState();

    const calculateValue = (multiplier) => {
      if (typeof multiplier !== 'number') {
        return;
      }

      return min + (max - min) * multiplier;
    };

    if (values instanceof Array) {
      this.update({
        ...data,
        value: calculateValue(value),
        values: [
          calculateValue(values[0]),
          calculateValue(values[1]),
        ]
      });

      return;
    }

    this.update({
      ...data,
      value: calculateValue(value)
    });
  }

  destroy() {
    this._model.destroy();
  }
}
