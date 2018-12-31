// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import { createEntity, addMix, Modifiable } from '../../bem';
// import TrackHint from './__hint/circle__hint';
// import Hint from '../hint/hint';
import './circle.scss';

export default class Circle extends Modifiable {
  constructor(setHtml) {
    super();

    const $html = $('<div class="circle"></div>');
    // const hint = createEntity({ Entity: Hint, $parent: $html });
    // const circleHint = addMix({
    //   block: hint,
    //   Element: TrackHint
    // });

    // this.hint = {
    //   hint,
    //   circleHint
    // };

    setHtml($html);
  }
}
