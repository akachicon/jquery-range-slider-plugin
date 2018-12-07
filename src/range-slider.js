// eslint-disable-next-line
import $ from 'jquery';
import Model from './model';
import View from './view';
import Controller from './controller';

export default function (options, root) {
  const model = new Model(options);
  const view = new View(model, root, options);
  const controller = new Controller(model, view);

  // let value = 0.5;
  //
  // setInterval(() => {
  //   value += 0.01;
  //   view._update({ value });
  // }, 500);

  return this;
}
