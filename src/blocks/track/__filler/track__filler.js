import { Modifiable } from '../../../bem';

export default class TrackFiller extends Modifiable {
  constructor($entityHtml) {
    super();

    this._marginPct = 0;
    $entityHtml.addClass('track__filler');
  }

  set marginPct(pct) {
    const { $html } = this;

    if (this.hasMod('track__filler_vertical')) {
      $html.css('margin-top', pct);
      $html.css('margin-left', 0);
    } else {
      $html.css('margin-top', 0);
      $html.css('margin-left', pct);
    }
    this._marginPct = pct;
  }

  get marginPct() {
    return this._marginPct;
  }
}
