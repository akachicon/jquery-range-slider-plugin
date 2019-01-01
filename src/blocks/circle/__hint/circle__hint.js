import { Modifiable } from '../../../bem';

export default class CircleHint extends Modifiable {
  constructor($blockHtml) {
    super();

    $blockHtml.addClass('circle__hint');
  }
}
