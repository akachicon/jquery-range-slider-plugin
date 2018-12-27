import { Block } from '../../../bem';

export default class TrackFiller extends Block {
  constructor($blockHtml) {
    super();

    $blockHtml.addClass('track__filler');
    this._$html = $blockHtml;
  }

  show() { // TODO: should be modifier
    this._$html.css('visibility', 'visible');
  }

  hide() {
    this._$html.css('visibility', 'hidden');
  }
}
