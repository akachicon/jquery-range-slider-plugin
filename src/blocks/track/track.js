// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import { createBlock, createElementFromBlock, Block } from '../../bem';
import TrackFiller from './__filler/track__filler';
import trackRange from './_range/track_range';
import trackVertical from './_vertical/track_vertical';
import Line from '../line/line';
import './track.scss';

export default class Track extends Block {
  constructor(setHtml) {
    super();

    const path = createBlock({ Block: Line });
    const fill = createBlock({ Block: Line, $parent: path.$html });
    const mask = createBlock({ Block: Line, $parent: path.$html });

    path.$html.addClass('track');

    this.path = path;
    this.fill = {
      line: fill,
      trackFiller: createElementFromBlock({
        Element: TrackFiller,
        block: fill
      })
    };
    this.mask = {
      line: mask,
      trackFiller: createElementFromBlock({
        Element: TrackFiller,
        block: mask
      })
    };

    this.fill.line.applyMod('line_trimmed');
    this.mask.line.applyMod('line_trimmed');
    this.mask.trackFiller.hide();

    [this.fill, this.mask]
      .forEach((filler) => {
        Object.defineProperty(filler, 'portion', {
          configurable: true,

          set(fraction) {
            // eslint-disable-next-line no-param-reassign
            filler.line.length = path.thickness / 2
              + (path.length - path.thickness) * fraction;
          },

          get() {
            return (filler.line.length - path.thickness / 2)
              / (path.length - path.thickness);
          }
        });
      });

    setHtml(path.$html);
  }
}

Object.assign(Track.prototype, {
  track_range: trackRange,
  track_vertical: trackVertical
});
