// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import Hint from './hint';
import './style.scss';

const sswitch = state => possibilities => possibilities[state];

export default class Thumb {
  constructor({ track, className = '' }) {
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

  addHint(config) {
    const hint = new Hint({ thumb: this, ...config });

    this.domElement.append(hint.domElement);
    this.hint = hint;

    return hint;
  }

  contains({ pageX, pageY }) {
    const pointerOffsetX = pageX - this.domElement.offset().left;
    const pointerOffsetY = pageY - this.domElement.offset().top;

    return pointerOffsetX >= 0
      && pointerOffsetY >= 0
      && pointerOffsetX <= this.domElement.width()
      && pointerOffsetY <= this.domElement.height();
  }

  _onMouseFactory(callback) {
    return (e) => {
      if (this.hint
        && this.hint.domElement
        && this.hint.domElement[0] === e.target) {
        return;
      }
      callback(e);
    };
  }

  set onMouseOver(callback) {
    this.domElement.off(
      'mouseover',
      this._onMouseOver
    );

    this._onMouseOver = this._onMouseFactory(callback);

    this.domElement.on(
      'mouseover',
      this._onMouseOver
    );
  }

  set onMouseOut(callback) {
    this.domElement.off(
      'mouseout',
      this._onMouseOut
    );

    this._onMouseOut = this._onMouseFactory(callback);

    this.domElement.on(
      'mouseout',
      this._onMouseOut
    );
  }

  get onMouseOver() {
    if (!this._onMouseOver) return;

    return this._onMouseOver;
  }

  get onMouseOut() {
    if (!this._onMouseOut) return;

    return this._onMouseOut;
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
