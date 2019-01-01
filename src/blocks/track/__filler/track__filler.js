import { Modifiable } from '../../../bem';
import TrackFillerVertical from './_vertical/track__filler_vertical';

export default class TrackFiller extends Modifiable {
  constructor($entityHtml) {
    super();

    this._marginPx = 0;
    $entityHtml.addClass('track__filler');
  }

  set marginPx(px) {
    const { $html } = this;

    if (this.hasMod('track__filler_vertical')) {
      $html.css('margin-top', `${px}px`);
    } else {
      $html.css('margin-left', `${px}px`);
    }
    this._marginPx = px;
  }

  get marginPct() {
    return this._marginPx;
  }
}

Object.assign(TrackFiller.prototype, {
  track__filler_vertical: TrackFillerVertical
});
