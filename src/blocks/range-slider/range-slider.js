// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
// import throttle from 'lodash.throttle';
import { createEntity, Modifiable } from '../../bem';
import Track from '../track/track';
// import Circle from '../circle/circle';
// import Marks from '../blocks/marks';
import './range-slider.scss';

export default class RangeSlider extends Modifiable {
  constructor(setHtml) {
    super();

    const $html = $('<div class="range-slider"></div>');
    const track = createEntity({ Entity: Track, $parent: $html });
    // const circle = createEntity({ Block: Circle, $parent: $html });
    //
    track.fill.line.$html.css('background', 'cornflowerblue');
    //
    this.track = track;

    setHtml($html);
  }

  didMount() {
    this.track.fillStartPortion = 0.3333333333333;
    this.track.fillEndPortion = 0.6666666666666;

    // setTimeout(() => {
    //   this.track.applyMod('track_range');
    // }, 1500);
    //
    // setTimeout(() => {
    //   this.applyMod('range-slider_vertical');
    //   this.track.applyMod('track_vertical');
    //   this.track.fill.portion = 0.66666666666;
    //   this.track.mask.portion = 0.33333333333;
    // }, 3000);
    //
    // setTimeout(() => {
    //   this.removeMod('range-slider_vertical');
    //   this.track.removeMod('track_vertical');
    //   this.track.fill.portion = 0.5;
    //   this.track.mask.portion = 0.25;
    // }, 4500);
  }
}
