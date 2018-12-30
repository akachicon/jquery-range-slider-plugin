import { createEntity, addMix, Modifiable } from '../../bem';
import TrackFiller from './__filler/track__filler';
import trackVertical from './_vertical/track_vertical';
import Line from '../line/line';
import './track.scss';

export default class Track extends Modifiable {
  constructor(setHtml) {
    super();

    const $html = ('<div class="track"></div>');
    const path = createEntity({ Entity: Line, $parent: $html });
    const fill = createEntity({ Entity: Line, $parent: path.$html });

    path.applyMod('line_rounded');

    this.path = path;
    this.fill = {
      line: fill,
      trackFiller: addMix({
        Mix: TrackFiller,
        entity: fill
      })
    };
    this._fillStartPortion = null;
    this._fillEndPortion = null;

    setHtml(path.$html);
  }

  set fillStartPortion(fraction) {
    let fillIndent = 0;

    if (fraction !== null) {
      const { path } = this;
      const pLength = path.lengthPx;
      const pThickness = path.thicknessPx;

      fillIndent = (fraction * (pLength - pThickness)
        + pThickness / 2) / pLength * 100;
    }
    this.fill.trackFiller.marginPct = fillIndent;
    this._fillStartPortion = fraction;
  }

  get fillStartPortion() {
    return this._fillStartPortion;
  }

  set fillEndPortion(fraction) {
    const { path, _fillStartPortion } = this;
    const pLength = path.lengthPx;
    const pThickness = path.thicknessPx;

    let fillLength;

    if (_fillStartPortion === null) {
      fillLength = (fraction * (pLength - pThickness)
        + pThickness / 2) / pLength * 100;
    } else {
      fillLength = (fraction - _fillStartPortion)
        * (pLength - pThickness) / pLength * 100;
    }

    this.fill.line.lengthPct = fillLength;
    this._endPortion = fraction;
  }

  get endPortion() {
    return this._fillEndPortion;
  }
}

Object.assign(Track.prototype, {
  track_vertical: trackVertical
});
