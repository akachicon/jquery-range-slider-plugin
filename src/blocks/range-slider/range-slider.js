// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
// import throttle from 'lodash.throttle';
import { createBlock, Block } from '../../bem';
import Track from '../track/track';
import Circle from '../circle/circle';
// import Marks from '../blocks/marks';
import './range-slider.scss';

export default class RangeSlider extends Block {
  constructor(setHtml) {
    super();

    const $html = $('<div class="range-slider"></div>');
    const track = createBlock({ Block: Track, $parent: $html });
    const circle = createBlock({ Block: Circle, $parent: $html });

    track.fill.line.$html.css('background', 'yellow');
    track.mask.line.$html.css('background', 'orange');

    this.track = track;

    setHtml($html);
  }

  didMount() {
    this.track.fill.portion = 0.6655555555555;
    this.track.mask.portion = 0.3333333333333;

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
