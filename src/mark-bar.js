// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import './style.scss';

const sswitch = state => possibilities => possibilities[state];

export default class MarkBar {
  constructor({ track, containerClassName = '', markClassName = '' }) {
    this._track = track;
    this._markBaseClass = markClassName;
    this.domElement = $(`<div class="${containerClassName}"></div>`);
  }

  update({ marks, min, max }) {
    const track = this._track;
    const baseClass = this._markBaseClass;
    const marksPositions = Object.keys(marks);
    const markSpans = [];

    const getPortion = value => (
      (value - min) / (max - min) * track.length
    );

    marksPositions.forEach((position) => {
      let label;
      let classList;

      /* eslint-disable prefer-destructuring */

      if (typeof marks[position] === 'object') {
        classList = marks[position].classList;
        label = marks[position].label;
      } else {
        label = marks[position];
      }

      /* eslint-enable prefer-destructuring */

      const indent = getPortion(+position);
      const indentDirection = this._indentDirection;
      const markSpan = `<span class="${baseClass} ${classList}" style="${indentDirection}:${indent}px;">${label}</span>`;

      markSpans.push(markSpan);
    });

    let occupiedSpace = -1;

    this.domElement.html(markSpans.join(''));
    this.domElement.children(`span.${baseClass.split(' ').join('.')}`)
      // eslint-disable-next-line prefer-arrow-callback
      .each(function () {
        const spanSpace = sswitch(track.orientation)({
          h: $(this).height(),
          v: $(this).width()
        });

        if (spanSpace > occupiedSpace) {
          occupiedSpace = spanSpace;
        }
      });

    sswitch(track.orientation)({
      h: this.domElement.height(occupiedSpace),
      v: this.domElement.width(occupiedSpace)
    });
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
}
