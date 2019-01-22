// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import { Modifiable } from '../../../bem';

export default class HintContent extends Modifiable {
  constructor(setHtml) {
    super();

    setHtml($('<div class="hint__content"></div>'));
  }

  set text(data) {
    this.$html.text(data);
  }

  get text() {
    return this.$html.text();
  }
}
