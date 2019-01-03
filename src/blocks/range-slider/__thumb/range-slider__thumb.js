import { Modifiable } from '../../../bem';
import RangeSliderThumbVertical from './_vertical/range-slider__thumb_vertical';

export default class RangeSliderThumb extends Modifiable {
  constructor($blockHtml) {
    super();

    $blockHtml.addClass('range-slider__thumb');
  }

  set marginPx(px) {
    const { $html } = this;

    if (this.hasMod('range-slider__thumb_vertical')) {
      $html.css('margin-top', `${px}px`);
    } else {
      $html.css('margin-left', `${px}px`);
    }
    this._marginPx = px;
  }

  get marginPx() {
    return this._marginPx;
  }
}

Object.assign(RangeSliderThumb.prototype, {
  'range-slider__thumb_vertical': RangeSliderThumbVertical
});
