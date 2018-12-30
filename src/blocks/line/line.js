// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import { Modifiable } from '../../bem';
import lineVertical from './_vertical/line_vertical';
import './line.scss';

export default class Line extends Modifiable {
  constructor(setHtml) {
    super();

    this._lengthPct = 100;
    setHtml($('<div class="line"></div>'));
  }

  set lengthPct(pct) {
    const { $html } = this;

    this._lengthPct = pct;
    if (this.hasMod('line_vertical')) {
      $html.height(`${pct}%`);

      return;
    }
    $html.width(`${pct}%`);
  }

  get lengthPct() {
    return this._lengthPct;
  }

  get lengthPx() {
    const { $html } = this;

    if (this.hasMod('line_vertical')) {
      return $html.height();
    }

    return $html.width();
  }

  get thicknessPx() {
    const { $html } = this;

    if (this.hasMod('line_vertical')) {
      return $html.width();
    }

    return $html.height();
  }
}

Object.assign(Line.prototype, {
  line_vertical: lineVertical
});
