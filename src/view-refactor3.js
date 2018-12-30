// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import AbstractView from './abstract-view';
import { createEntity, createMixin, Modifiable } from './bem';
import RangeSlider from './blocks/range-slider/range-slider';

const POINTER_CHECK_INTERVAL = 70;

const sswitch = state => possibilities => possibilities[state];

export default class View extends AbstractView {
  constructor(model, $root, initialState) {
    super(model);

    this._model = model;
    this._$root = $root;
    this._state = {};

    this._rangeSlider = createEntity({ $parent: $root, Block: RangeSlider });

    // const track = new Track({
    //   className: 'track'
    // });
    // const thumbs = {};
    // const ranges = {};

  //   [
  //     'single',
  //     'first',
  //     'second'
  //   ].forEach((name) => {
  //     const thumb = track.addThumb({
  //       className: 'thumb'
  //     });
  //
  //     thumb.addHint({
  //       className: 'hint'
  //     });
  //     thumb.onMouseOver = this._thumbOnMouseFactory('over', thumb);
  //     thumb.onMouseOut = this._thumbOnMouseFactory('out', thumb);
  //
  //     thumbs[name] = thumb;
  //   });
  //
  //   [
  //     ['inner', 'range-inner'],
  //     ['outer', 'range-outer']
  //   ].forEach(([name, className]) => {
  //     ranges[name] = div(className);
  //   });
  //
  //   ranges.outer.append(ranges.inner);
  //   track.domElement.append(ranges.outer);
  //
  //   const marks = track.addMarks({
  //     containerClassName: 'marks-container',
  //     markClassName: 'marks-entry'
  //   });
  //
  //   $root.addClass('rangeSliderContainer');
  //   track.appendTo($root);
  //
  //   $root.on(
  //     'mousedown',
  //     this._onMouseDown.bind(this)
  //   );
  //   track.domElement.on(
  //     'click',
  //     this._onMouseClick.bind(this)
  //   );
  //
  //   this._track = track;
  //   this._thumbs = thumbs;
  //   this._ranges = ranges;
  //   this._marks = marks;
  //
  //   this._onUpdate(initialState);
  }
}
