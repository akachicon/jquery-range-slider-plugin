import { Block } from '../../../bem';

export default class CircleHint extends Block {
  constructor($blockHtml) {
    super();

    $blockHtml.addClass('circle__hint');
    this._$html = $blockHtml;
  }

  show() { // TODO: should be modifier
    this._$html.css('visibility', 'visible');
  }

  hide() {
    this._$html.css('visibility', 'hidden');
  }
}
