// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import { Block } from '../../bem';
import lineVertical from './_vertical/line_vertical';
import './line.scss';

export default class Line extends Block {
  constructor(setHtml) {
    super();

    setHtml($('<div class="line"></div>'));
  }

  set length(pixels) {
    this.$html.width(pixels);
  }

  get length() {
    return this.$html.width();
  }

  get thickness() {
    return this.$html.height();
  }
}

Line.prototype.line_vertical = lineVertical;
