export default class Element {
  constructor($blockHtml) {
    $blockHtml.addClass('track__filler');

    this._$html = $blockHtml;
  }

  show() {
    this._$html.css('visibility', 'visible');
  }

  hide() {
    this._$html.css('visibility', 'hidden');
  }
}
