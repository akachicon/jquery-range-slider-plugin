import { Modifiable } from '../../../bem';
import trackFillerVertical from './_vertical/track__filler_vertical';

export default class TrackFiller extends Modifiable {
  constructor($blockHtml) {
    super();

    this._marginPx = 0;
    $blockHtml.addClass('track__filler');
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

  get marginPx() {
    return this._marginPx;
  }
}

Object.assign(TrackFiller.prototype, {
  track__filler_vertical: trackFillerVertical
});
