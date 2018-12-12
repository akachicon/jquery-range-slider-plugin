// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import './style.scss';

const sswitch = state => possibilities => possibilities[state];

export default class Thumb {
  constructor({ track, className }) {
    this._track = track;
    this.domElement = $(`<div class="${className}"></div>`);
  }

  getPortion() {
    const track = this._track;
    const axis = this._indentDirection;
    const thumbLength = parseFloat(this.domElement.css(axis));

    return thumbLength / track.length;
  }

  setPortion(value) {
    return this.domElement.css(
      this._indentDirection,
      `${value * this._track.length}px`
    );
  }

  hide() {
    this.domElement.css('display', 'none');
  }

  show() {
    this.domElement.css('display', 'block');
  }

  get _indentDirection() {
    return sswitch(this._track.orientation)({
      h: 'left',
      v: 'top',
    });
  }

  get radius() {
    return sswitch(this._track.orientation)({
      h: this.domElement.width() / 2,
      v: this.domElement.height() / 2
    });
  }
}
