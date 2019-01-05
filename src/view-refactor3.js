// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import throttle from 'lodash.throttle';
import AbstractView from './abstract-view';
import { createEntity } from './bem';
import RangeSlider from './blocks/range-slider/range-slider';

const POINTER_CHECK_INTERVAL = 70;

export default class View extends AbstractView {
  constructor(model, $root, initialState) {
    super(model);

    this._model = model;
    this._$root = $root;
    this._state = {};

    const rangeSlider = createEntity({ Entity: RangeSlider, $parent: $root });

    rangeSlider.applyMod('range-slider_range_single');

    Object.values(rangeSlider.thumbs)
      .forEach((thumb) => {
        thumb.circle.$html.on(
          'mousedown',
          this._thumbOnMouseDown.bind(this)
        );
      });

    rangeSlider.track.$html.on(
      'click',
      this._trackOnMouseClick.bind(this)
    );

    this._rangeSlider = rangeSlider;
    this._activeThumb = null;
    this._onUpdate(initialState);
  }

  _thumbOnMouseDown(e) {
    e.preventDefault();

    [this._activeThumb] = Object.values(
      this._rangeSlider.thumbs
    ).filter(thumb => (
      thumb.circle.$html[0] === e.target
    ));

    const body = $(document.body);
    const throttledCheck = throttle(
      this._checkPointerAndSendUpdate.bind(this),
      POINTER_CHECK_INTERVAL
    );

    body.on('mousemove', throttledCheck);
    body.one('mouseup', (evt) => {
      body.off('mousemove', throttledCheck);

      this._attemptToHideHint(evt);
      this._activeThumb = null;
    });
  }

  _trackOnMouseClick(e) {
    e.preventDefault();

    const rangeSlider = this._rangeSlider;

    if (rangeSlider.hasMod('range-slider_range_multiple')) {
      const {
        rangeFirst: first,
        rangeSecond: second
      } = rangeSlider.thumbs;
      const pointerPortion = rangeSlider.track.getPointPortion(e);

      if (pointerPortion < first.portion) {
        this._activeThumb = first;
      } else if (pointerPortion > second.portion) {
        this._activeThumb = second;
      } else {
        const diff = second.portion - first.portion;

        if (pointerPortion < first.portion + diff / 2) {
          this._activeThumb = first;
        } else {
          this._activeThumb = second;
        }
      }
    }

    this._checkPointerAndSendUpdate(e);
    this._attemptToHideHint(e);
    this._activeThumb = null;
  }

  _checkPointerAndSendUpdate(e) {
    e.preventDefault();

    const { thumbs, track } = this._rangeSlider;
    const {
      rangeFirst: first,
      rangeSecond: second
    } = thumbs;
    const pointerPortion = track.getPointPortion(e);
    const { min, max, values } = this._state;

    let valueToSend;
    let valuesToSend = [];

    switch (this._activeThumb) {
      case first: {
        if (pointerPortion > second.portion) {
          valuesToSend[0] = (values[1] - min) / (max - min);
          valuesToSend[1] = pointerPortion;

          this._activeThumb = second;
        } else {
          valuesToSend = [pointerPortion, null];
        }
        break;
      }
      case second: {
        if (pointerPortion < first.portion) {
          valuesToSend[0] = pointerPortion;
          valuesToSend[1] = (values[0] - min) / (max - min);

          this._activeThumb = first;
        } else {
          valuesToSend = [null, pointerPortion];
        }
        break;
      }
      default: {
        valueToSend = pointerPortion;
      }
    }

    this._publishUpdate({
      value: valueToSend,
      values: valuesToSend
    });
  }

  _attemptToHideHint(e) {
    console.log('attempt to hide hint');
  }

  _onUpdate(data) {
    const {
      _state: current,
      _rangeSlider: rangeSlider
    } = this;
    const {
      single,
      rangeFirst: first,
      rangeSecond: second
    } = rangeSlider.thumbs;
    const {
      min,
      max,
      value,
      values = [],
      range,
      orientation,
      // marks,
      // hint
    } = data;

    const calcPortion = (val) => {
      if (val === undefined) return null;

      return (val - min) / (max - min);
    };

    if (orientation !== current.orientation) {
      this._updateOrientation(orientation);
    }
    if (range !== current.range) {
      this._updateRange(range, calcPortion);
    }

    single.portion = calcPortion(value);
    first.portion = calcPortion(values[0]);
    second.portion = calcPortion(values[1]);

    single.circle.hintText = value;
    [first.circle.hintText, second.circle.hintText] = values;

    this._state = data;
  }

  _updateOrientation(orientation) {
    const { _rangeSlider: rangeSlider } = this;

    if (orientation === 'h') {
      rangeSlider.removeMod('range-slider_vertical');
    }
    if (orientation === 'v') {
      rangeSlider.applyMod('range-slider_vertical');
    }
  }

  _updateRange(shouldBeInterval) {
    const rangeSlider = this._rangeSlider;

    if (shouldBeInterval) {
      rangeSlider.applyMod('range-slider_range_multiple');

      return;
    }
    rangeSlider.removeMod('range-slider_range_multiple');
  }

  _publishUpdate(data) {
    this._publish('portionUpdate', data);
  }
}
