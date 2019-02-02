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

const RESIZE_CHECK_INTERVAL = 500;

export default class RangeSlider extends Modifiable {
  constructor(setHtml) {
    super();

    const $html = $('<div class="range-slider"></div>');
    const track = createEntity({ Entity: Track, $parent: $html });
    const thumbs = {};

    const singleThumbPortion = (fraction) => {
      if (this.hasMod('range-slider_range_multiple')) {
        return;
      }
      track.fillEndPortion = fraction;
    };
    const rangeFirstThumbPortion = (fraction) => {
      if (!this.hasMod('range-slider_range_multiple')) {
        return;
      }
      track.fillStartPortion = fraction;
    };
    const rangeSecondThumbPortion = (fraction) => {
      if (!this.hasMod('range-slider_range_multiple')) {
        return;
      }
      track.fillEndPortion = fraction;
    };

    [
      ['single', singleThumbPortion],
      ['rangeFirst', rangeFirstThumbPortion],
      ['rangeSecond', rangeSecondThumbPortion]
    ].forEach(([name, portionCallback]) => {
      thumbs[name] = RangeSlider.genThumb({
        track,
        portionCallback,
        $parent: $html
      });
    });

    thumbs.rangeFirst.rangeSliderThumb.applyMod('range-slider__thumb_hidden');
    thumbs.rangeSecond.rangeSliderThumb.applyMod('range-slider__thumb_hidden');

    this.track = track;
    this.thumbs = thumbs;

    setHtml($html);
  }

  didMount() {
    this._width = this.$html.width();
    this._height = this.$html.height();

    this._onResizeInterval = setInterval(
      this._onResize.bind(this),
      RESIZE_CHECK_INTERVAL
    );
  }

  destroy() {
    clearInterval(this._onResizeInterval);
  }

  _onResize() {
    const currentWidth = this.$html.width();
    const currentHeight = this.$html.height();

    if (this._width !== currentWidth
        || this._height !== currentHeight) {
      Object.values(this.thumbs)
        .forEach((thumb) => {
          thumb.syncPortion();
        });
      this._width = currentWidth;
      this._height = currentHeight;
    }
  }

  static genThumb({ track, portionCallback, $parent }) {
    const circle = createEntity({ Entity: Circle, $parent });

    circle.applyMod('circle_color_53b6a8');
    circle.hint.hint.applyMod('hint_color_53b6a8');

    return {
      circle,
      rangeSliderThumb: addMix({
        Mix: RangeSliderThumb,
        entity: circle
      }),
      _portion: null,

      set portion(fraction) {
        portionCallback(fraction);

        this.rangeSliderThumb.marginPx = track.distancePx * fraction;
        this._portion = fraction;
      },

      get portion() {
        return this._portion;
      },

      syncPortion() {
        this.portion = this._portion;
      }
    };
  }
}

Object.assign(RangeSlider.prototype, {
  'range-slider_vertical': rangeSliderVertical,
  'range-slider_range_single': rangeSliderRange.single,
  'range-slider_range_multiple': rangeSliderRange.multiple
});
