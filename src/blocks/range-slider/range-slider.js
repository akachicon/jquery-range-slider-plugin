// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import { createEntity, addMix, Modifiable } from '../../bem';
import RangeSliderThumb from './__thumb/range-slider__thumb';
import RangeSliderVertical from './_vertical/range-slider_vertical';
import Track from '../track/track';
import Circle from '../circle/circle';
// import Marks from '../blocks/marks';
import './range-slider.scss';

export default class RangeSlider extends Modifiable {
  constructor(setHtml) {
    super();

    const $html = $('<div class="range-slider"></div>');
    const track = createEntity({ Entity: Track, $parent: $html });

    this.track = track;
    this.thumbs = {};

    [
      'single',
      'rangeFirst',
      'rangeSecond'
    ].forEach((name) => {
      this.addThumb({ name, track, $parent: $html });
    });

    setHtml($html);
  }

  addThumb({ name, track, $parent }) {
    const circle = createEntity({ Entity: Circle, $parent });

    this.thumbs[name] = {
      circle,
      rangeSliderThumb: addMix({
        Mix: RangeSliderThumb,
        entity: circle
      }),
      _portion: 0,

      set portion(fraction) {
        if (name === 'rangeFirst') {
          // eslint-disable-next-line no-param-reassign
          track.fillStartPortion = fraction;
        } else {
          // eslint-disable-next-line no-param-reassign
          track.fillEndPortion = fraction;
        }
        this.rangeSliderThumb.marginPx = track.distancePx * fraction;
        this._portion = fraction;
      },

      get portion() {
        return this._portion;
      }
    };
  }

  didMount() {
    const { track, thumbs } = this;
    const { single, rangeFirst, rangeSecond } = thumbs;

    single.portion = 0.25;
    rangeFirst.portion = 0.5;
    rangeSecond.portion = 1;

    setTimeout(() => {
      this.applyMod('range-slider_vertical');
    }, 1000);

    setTimeout(() => {
      rangeFirst.portion = 0.35;
      rangeSecond.portion = 0.65;
    }, 2000);

    setTimeout(() => {
      this.removeMod('range-slider_vertical');
    }, 3000);
  }
}

Object.assign(RangeSlider.prototype, {
  'range-slider_vertical': RangeSliderVertical
});
