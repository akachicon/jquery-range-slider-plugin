// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import { createEntity, addMix, Modifiable } from '../../bem';
import TrackPath from './__path/track__path';
import TrackFiller from './__filler/track__filler';
import TrackVertical from './_vertical/track_vertical';
import Line from '../line/line';
import './track.scss';

export default class Track extends Modifiable {
  constructor(setHtml) {
    super();

    const $html = $('<div class="track"></div>');
    const path = createEntity({ Entity: Line, $parent: $html });
    const fill = createEntity({ Entity: Line, $parent: path.$html });

    path.applyMod('line_rounded');

    this.path = {
      line: path,
      trackPath: addMix({
        Mix: TrackPath,
        entity: path
      })
    };
    this.fill = {
      line: fill,
      trackFiller: addMix({
        Mix: TrackFiller,
        entity: fill
      })
    };
    this._fillStartPortion = null;
    this._fillEndPortion = 0;

    setHtml($html);
  }

  set fillStartPortion(fraction) {
    const { _fillEndPortion } = this;
    let fillIndent = 0;

    if (fraction !== null) {
      const {
        lengthPx: pLength,
        thicknessPx: pThickness
      } = this.path.line;

      fillIndent = pThickness / 2 + fraction * (pLength - pThickness);
    }

    this.fill.trackFiller.marginPx = fillIndent;
    this._fillStartPortion = fraction;

    if (_fillEndPortion !== null) {
      this.fillEndPortion = _fillEndPortion;
    }
  }

  get fillStartPortion() {
    return this._fillStartPortion;
  }

  set fillEndPortion(fraction) {
    const { path, _fillStartPortion } = this;
    const {
      lengthPx: pLength,
      thicknessPx: pThickness
    } = path.line;

    let fillLength;

    if (_fillStartPortion === null) {
      fillLength = (fraction * (pLength - pThickness)
        + pThickness / 2) / pLength * 100;
    } else {
      fillLength = (fraction - _fillStartPortion)
        * (pLength - pThickness) / pLength * 100;
    }

    this.fill.line.lengthPct = fillLength;
    this._fillEndPortion = fraction;
  }

  get fillEndPortion() {
    return this._fillEndPortion;
  }
}

Object.assign(Track.prototype, {
  track_vertical: TrackVertical
});
