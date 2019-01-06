// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import { createEntity, addMix, Modifiable } from '../../bem';
import circleHintHidden from './_hint-hidden/circle_hint-hidden';
import circleHintPositionLeft from './_hint-position_left/circle_hint-position_left';
import CircleHint from './__hint/circle__hint';
import Hint from '../hint/hint';
import './circle.scss';

export default class Circle extends Modifiable {
  constructor(setHtml) {
    super();

    const $html = $('<div class="circle"></div>');
    const hint = createEntity({ Entity: Hint, $parent: $html });
    const circleHint = addMix({
      Mix: CircleHint,
      entity: hint
    });

    this.hint = {
      hint,
      circleHint
    };

    setHtml($html);
  }

  set hintText(data) {
    this.hint.hint.text = data;

    this._hintText = data;
  }

  get hintText() {
    return this._hintText;
  }
}

Object.assign(Circle.prototype, {
  'circle_hint-hidden': circleHintHidden,
  'circle_hint-position_left': circleHintPositionLeft
});
