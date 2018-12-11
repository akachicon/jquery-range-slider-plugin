// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import Thumb from './thumb';
import './style.scss';

const sswitch = state => possibilities => possibilities[state];

export default class Track {
  constructor({ className, orientation = 'h' }) {
    const domElement = $(`<div class="${className}"></div>`);

    this.domElement = domElement;
    this.orientation = orientation;
    this.thumbs = [];
  }

  appendTo(parent) {
    parent.append(
      this.domElement,
      this.thumbs.map(thumb => (
        thumb.domElement
      ))
    );
  }

  getPointPortion({ pageX, pageY }) {
    const pointerLength = sswitch(this.orientation)({
      h: pageX,
      v: pageY,
    });

    return (pointerLength - this.start - this.thickness / 2) / this.length;
  }

  addThumb(config) {
    const thumb = new Thumb({ track: this, ...config });

    this.thumbs.push(thumb);

    return thumb;
  }

  get length() {
    const track = this.domElement;
    const length = sswitch(this.orientation)({
      h: 'width',
      v: 'height'
    });

    return track[length]();
  }

  get thickness() {
    const track = this.domElement;
    const thickness = sswitch(this.orientation)({
      h: 'height',
      v: 'width'
    });

    return track[thickness]();
  }

  get start() {
    const trackStart = this.domElement.offset();
    const axis = sswitch(this.orientation)({
      h: 'left',
      v: 'top'
    });

    return trackStart[axis];
  }
}
