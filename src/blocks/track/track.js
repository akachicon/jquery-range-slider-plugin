// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import { createEntity, addMix, Modifiable } from '../../bem';
import TrackPath from './__path/track__path';
import TrackFiller from './__filler/track__filler';
import trackVertical from './_vertical/track_vertical';
import trackEmpty from './_empty/track_empty';
import Line from '../line/line';
import './track.scss';

export default class Track extends Modifiable {
  constructor(setHtml) {
    super();

    const $html = $('<div class="track"></div>');
    const path = createEntity({ Entity: Line, $parent: $html });
    const fill = createEntity({ Entity: Line, $parent: path.$html });

    path.applyMod('line_rounded');
    path.applyMod('line_color_e5e5e5');
    fill.applyMod('line_color_53b6a8');

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

  getPointPortion({ pageX, pageY }) {
    let pathStart;
    let pointPosition;

    const {
      lengthPx: pathLength,
      thicknessPx: pathThickness,
      $html: $pathHtml
    } = this.path.line;

    if (this.hasMod('track_vertical')) {
      pointPosition = pageY;
      pathStart = $pathHtml.offset().top;
    } else {
      pointPosition = pageX;
      pathStart = $pathHtml.offset().left;
    }

    return (pointPosition - pathStart - pathThickness / 2)
      / (pathLength - pathThickness);
  }

  get distancePx() {
    const {
      lengthPx: pathLength,
      thicknessPx: pathThickness
    } = this.path.line;

    return pathLength - pathThickness;
  }

  set fillStartPortion(fraction) {
    const { _fillEndPortion } = this;
    let fillIndent = 0;

    if (fraction !== null) {
      const {
        lengthPx: pathLength,
        thicknessPx: pathThickness
      } = this.path.line;

      fillIndent = pathThickness / 2
        + fraction * (pathLength - pathThickness);
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
      lengthPx: pathLength,
      thicknessPx: pathThickness
    } = path.line;

    let fillLength;

    if (_fillStartPortion === null) {
      fillLength = (fraction * (pathLength - pathThickness)
        + pathThickness / 2) / pathLength * 100;
    } else {
      fillLength = (fraction - _fillStartPortion)
        * (pathLength - pathThickness) / pathLength * 100;
    }

    this.fill.line.lengthPct = fillLength;
    this._fillEndPortion = fraction;
  }

  get fillEndPortion() {
    return this._fillEndPortion;
  }
}

Object.assign(Track.prototype, {
  track_vertical: trackVertical,
  track_empty: trackEmpty
});
