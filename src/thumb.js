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
    const axis = sswitch(track.orientation)({
      h: 'left',
      v: 'top',
    });
    const thumbLength = parseFloat(this.domElement.css(axis));

    return thumbLength / track.length;
  }

  setPortion(value) {
    const track = this._track;
    const axis = sswitch(track.orientation)({
      h: 'left',
      v: 'top',
    });

    this.domElement.css(axis, `${value * track.length}px`);
  }

  hide() {
    this.domElement.css('display', 'none');
  }

  show() {
    this.domElement.css('display', 'block');
  }

  get radius() {
    return this.domElement.width() / 2;
  }
}
