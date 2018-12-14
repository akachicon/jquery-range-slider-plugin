// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import './style.scss';

export default class Thumb {
  constructor({ thumb, className = '' }) {
    this._thumb = thumb;
    this.domElement = $(`<div class="${className}"></div>`);
    this.domElement.css('visibility', 'hidden');
  }

  hide() {
    this.domElement.css('visibility', 'hidden');
  }

  show() {
    this.domElement.css('visibility', 'visible');
  }

  enable() {
    this.domElement.css('display', 'block');
  }

  disable() {
    this.domElement.css('display', 'none');
  }

  set content(content) {
    this.domElement.text(content);
  }

  get content() {
    return this.domElement.text();
  }
}
