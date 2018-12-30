// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import { createEntity, Modifiable } from '../../bem';
import HintContent from './__content/hint__content';
import HintArrow from './__arrow/hint__arrow';
import './hint.scss';

export default class Hint extends Modifiable {
  constructor(setHtml) {
    super();

    const $html = $('<div class="hint"></div>');
    const hintContent = createEntity({ Block: HintContent, $parent: $html });
    const hintArrow = createEntity({ Block: HintArrow, $parent: $html });

    this.$container = $html;
    this.content = hintContent;
    this.arrow = hintArrow;

    setHtml(this.$container);
  }

  set content(data) {
    this.$container.text(data);
  }

  get content() {
    return this.$container.text();
  }
}
