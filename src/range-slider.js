// eslint-disable-next-line
import $ from 'jquery';
import Model from './model';
import View from './view';

export default function (defaults, options) {
  const mythicalRootElement = null;

  const model = new Model(defaults, options);
  const view = new View(model, mythicalRootElement);

  model.updateValue(12);

  setTimeout(() => {
    // console.log(model.getState());
    // model.updateValue(87);
    // console.log(model.getState());
    // model.disable(); console.log('disabled');
    // model.updateValue(4);
    // console.log(model.getState());
    // model.enable(); console.log('enaabled');
    // model.updateAll({
    //   min: -5,
    //   max: 5
    // });
    // console.log(model.getState());
    // model.disable(); console.log('disabled');
    // model.updateValue(4);
    // console.log(model.getState());
  }, 0);
  return this;
}
