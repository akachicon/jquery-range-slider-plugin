// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import { Block } from '../../bem';
import './hint.scss';

export default class Hint extends Block {
  constructor(setHtml) {
    super();

    this.$container = $('<div class="hint">Hint</div>');

    setHtml(this.$container);
  }

  set content(data) {
    this.$container.text(data);
  }

  get content() {
    return this.$container.text();
  }
}
