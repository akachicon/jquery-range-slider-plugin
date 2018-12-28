import { Block } from '../../../bem';

export default class CircleHint extends Block {
  constructor($blockHtml) {
    super();

    $blockHtml.addClass('circle__hint');
    this.$html = $blockHtml;
  }
}
