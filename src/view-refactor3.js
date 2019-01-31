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
        thumb.circle.$html.on(
          'mouseover',
          this._thumbOnMouseOver.bind(this, thumb)
        );
        thumb.circle.$html.on(
          'mouseout',
          this._thumbOnMouseOut.bind(this, thumb)
        );

        thumb.circle.applyMod('circle_hint-hidden');
      });

    rangeSlider.$html.on(
      'click',
      this._trackOnMouseClick.bind(this)
    );

    this._rangeSlider = rangeSlider; // TODO: make public
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

      this._onMouseUpData = evt;
      this._activeThumb = null;
    });
  }

  _thumbOnMouseOver(thumb, e) {
    e.preventDefault();

    if (!this._state.hint
        || this._activeThumb !== null) {
      return;
    }

    thumb.circle.removeMod('circle_hint-hidden');
  }

  _thumbOnMouseOut(thumb, e) {
    e.preventDefault();

    if (this._activeThumb !== null) return;

    thumb.circle.applyMod('circle_hint-hidden');
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
    } = data;

    const calcPortion = (val) => {
      if (val === undefined) return null;

      return (val - min) / (max - min);
    };

    if (orientation !== current.orientation) {
      this._updateOrientation(orientation);
    }
    if (range !== current.range) {
      this._updateRange(range);
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
      rangeSlider.removeMod('range-slider_range_single');
      rangeSlider.applyMod('range-slider_range_multiple');

      return;
    }
    rangeSlider.removeMod('range-slider_range_multiple');
    rangeSlider.applyMod('range-slider_range_single');
  }

  _publishUpdate(data) {
    this._publish('portionUpdate', data);
  }

  set _activeThumb(next) {
    const { _state: state, __activeThumb: current } = this;

    if (current !== null && current !== undefined) {
      current.rangeSliderThumb.removeMod('range-slider__thumb_z-top');

      if (next !== null) {
        current.circle.applyMod('circle_hint-hidden');
        if (state.hint) {
          next.circle.removeMod('circle_hint-hidden');
        }
      } else {
        const contains = ($html, { pageX, pageY }) => {
          const pointerOffsetX = pageX - $html.offset().left;
          const pointerOffsetY = pageY - $html.offset().top;

          return pointerOffsetX >= 0
            && pointerOffsetY >= 0
            && pointerOffsetX <= $html.width()
            && pointerOffsetY <= $html.height();
        };

        if (!contains(current.circle.$html, this._onMouseUpData)) {
          current.circle.applyMod('circle_hint-hidden');
        }
      }
    }

    if (next) {
      next.rangeSliderThumb.applyMod('range-slider__thumb_z-top');
    }

    this.__activeThumb = next;
  }

  get _activeThumb() {
    return this.__activeThumb;
  }
}
