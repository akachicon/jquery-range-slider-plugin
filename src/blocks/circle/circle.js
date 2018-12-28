// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import { createBlock, createElementFromBlock, Block } from '../../bem';
import TrackHint from './__hint/circle__hint';
import Hint from '../hint/hint';
import './circle.scss';

export default class Circle extends Block {
  constructor(setHtml) {
    super();

    const $html = $('<div class="circle"></div>');
    const hint = createBlock({ Block: Hint, $parent: $html });
    const circleHint = createElementFromBlock({
      block: hint,
      Element: TrackHint
    });

    this.hint = {
      hint,
      circleHint
    };

    setHtml($html);
  }
}
