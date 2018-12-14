// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import Thumb from './thumb';
import MarkBar from './mark-bar';
import './style.scss';

const sswitch = state => possibilities => possibilities[state];

export default class Track {
  constructor({ orientation = 'h', className = '' }) {
    this.domElement = $(`<div class="${className}"></div>`);
    this.orientation = orientation;
    this.pendingToAppend = [];
    this.thumbs = [];
    this.marks = null;
  }

  appendTo(parent) {
    parent.append(this.domElement, this.pendingToAppend);
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

    this._appendToTrackParent(thumb.domElement);
    this.thumbs.push(thumb);

    return thumb;
  }

  addMarks(config) {
    if (this.marks) {
      return this.marks;
    }

    const marks = new MarkBar({ track: this, ...config });

    this._appendToTrackParent(marks.domElement);
    this.marks = marks;

    return marks;
  }

  _appendToTrackParent(domElement) {
    const trackParent = this.domElement.parent();

    if (!trackParent.length) {
      this.pendingToAppend.push(domElement);

      return;
    }

    trackParent.append(domElement);
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
