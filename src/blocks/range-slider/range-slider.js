// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
// import throttle from 'lodash.throttle';
import { createEntity, addMix, Modifiable } from '../../bem';
import RangeSliderThumb from './__thumb/range-slider__thumb';
import Track from '../track/track';
import Circle from '../circle/circle';
// import Marks from '../blocks/marks';
import './range-slider.scss';

export default class RangeSlider extends Modifiable {
  constructor(setHtml) {
    super();

    const $html = $('<div class="range-slider"></div>');
    const track = createEntity({ Entity: Track, $parent: $html });
    const circle = createEntity({ Entity: Circle, $parent: $html });

    track.fill.line.$html.css('background', 'blue');
    circle.hint.hint.text = 'Hint!';

    this.track = track;
    this.thumb = {
      circle,
      rangeSliderThumb: addMix({
        Mix: RangeSliderThumb,
        entity: circle
      })
    };

    setHtml($html);
  }

  didMount() {
    this.track.fillStartPortion = 0.3333333333333;
    this.track.fillEndPortion = 0.6666666666666;

    setTimeout(() => {
      this.track.fillStartPortion = null;
    }, 1500);

    setTimeout(() => {
      this.applyMod('range-slider_vertical');
      this.track.applyMod('track_vertical');
      // this.track.fillStartPortion = null;
      // this.track.fillEndPortion = 0.5;

      this.thumb.circle.applyMod('circle_hint-position_left');

      this.thumb.circle.hint.hint.text = 'Loooooooooooooong';
    }, 3000);

    setTimeout(() => {
      this.removeMod('range-slider_vertical');
      this.track.removeMod('track_vertical');
      this.track.fillStartPortion = 0.25;
      this.track.fillEndPortion = 0.5;

      this.thumb.circle.removeMod('circle_hint-position_left');

      this.thumb.circle.$html.css('margin-left', '20px');
    }, 4500);
  }
}
