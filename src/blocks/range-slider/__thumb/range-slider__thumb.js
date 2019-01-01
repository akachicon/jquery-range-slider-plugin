import { Modifiable } from '../../../bem';

export default class RangeSliderThumb extends Modifiable {
  constructor($blockHtml) {
    super();

    $blockHtml.addClass('range-slider__thumb');
  }
}
