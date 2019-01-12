// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import { createEntity, Modifiable } from '../../bem';
import HintContent from './__content/hint__content';
import hintLeft from './_left/hint_left';
import hintColor from './_color/hint_color';
import './hint.scss';

export default class Hint extends Modifiable {
  constructor(setHtml) {
    super();

    const $html = $('<div class="hint"></div>');

    this.content = createEntity({ Entity: HintContent, $parent: $html });
    setHtml($html);
  }

  set text(data) {
    this.content.text = data;
  }

  get text() {
    return this.content.text;
  }
}

Object.assign(Hint.prototype, {
  hint_left: hintLeft,
  hint_color_53b6a8: hintColor['53b6a8']
});
