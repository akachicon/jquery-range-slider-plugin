// eslint-disable-next-line
import $ from 'jquery';
import Model from './model';
import View from './view';

export default function (options) {
  // const mythicalRootElement = this;

  const model = new Model(options);
  // const view = new View(model, mythicalRootElement);

  console.log(model.getState());
  model.update({ value: 12 });
  console.log(model.getState());
  model.update({ max: 5 });
  console.log(model.getState());

  return this;
}
