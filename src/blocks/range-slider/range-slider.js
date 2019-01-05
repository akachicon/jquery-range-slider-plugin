// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import { createEntity, addMix, Modifiable } from '../../bem';
import RangeSliderThumb from './__thumb/range-slider__thumb';
import rangeSliderVertical from './_vertical/range-slider_vertical';
import rangeSliderRange from './_range/range-slider_range';
import Track from '../track/track';
import Circle from '../circle/circle';
// import Marks from '../blocks/marks';
import './range-slider.scss';

export default class RangeSlider extends Modifiable {
  constructor(setHtml) {
    super();

    const $html = $('<div class="range-slider"></div>');
    const track = createEntity({ Entity: Track, $parent: $html });
    const thumbs = {};

    [
      'single',
      'rangeFirst',
      'rangeSecond'
    ].forEach((name) => {
      thumbs[name] = this.genThumb({
        name,
        track,
        $parent: $html
      });
    });
    track.applyMod('track_empty');
    thumbs.rangeFirst.rangeSliderThumb.applyMod('range-slider__thumb_hidden');
    thumbs.rangeSecond.rangeSliderThumb.applyMod('range-slider__thumb_hidden');

    this.track = track;
    this.thumbs = thumbs;

    track.fill.trackFiller.$html.css('background', 'brown');

    setHtml($html);
  }

  genThumb({ name, track, $parent }) {
    const circle = createEntity({ Entity: Circle, $parent });
    const that = this;

    return {
      circle,
      rangeSliderThumb: addMix({
        Mix: RangeSliderThumb,
        entity: circle
      }),
      _portion: null,

      set portion(fraction) {
        let singleMode = true;

        if (that.hasMod('range-slider_range_multiple')) {
          singleMode = false;
        }

        /* eslint-disable no-param-reassign */
        if (singleMode) {
          if (name === 'single') {
            track.fillEndPortion = fraction;
          }
        } else {
          if (name === 'rangeFirst') {
            track.fillStartPortion = fraction;
          }
          if (name === 'rangeSecond') {
            track.fillEndPortion = fraction;
          }
        }
        /* eslint-enable no-param-reassign */

        this.rangeSliderThumb.marginPx = track.distancePx * fraction;
        this._portion = fraction;
      },

      get portion() {
        return this._portion;
      }
    };
  }
}

Object.assign(RangeSlider.prototype, {
  'range-slider_vertical': rangeSliderVertical,
  'range-slider_range_single': rangeSliderRange.single,
  'range-slider_range_multiple': rangeSliderRange.multiple
});
