// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import AbstractView from './abstract-view';

export default class View extends AbstractView {
  constructor(model, rootElement) {
    super(model);
  }

  onValueUpdate(value) {
    console.log(value);
  }
}
