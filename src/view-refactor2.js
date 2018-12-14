// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import throttle from 'lodash.throttle';
import Model from './model';
import AbstractView from './abstract-view';
import Track from './track';
import './style.scss';

const POINTER_CHECK_INTERVAL = 70;

const sswitch = state => possibilities => possibilities[state];

export default class View extends AbstractView {
  constructor(model, root, initialState) {
    super(model);

    this._model = model;
    this._root = root;
    this._state = {};

    const div = className => (
      $(`<div class="${className}"></div>`)
    );

    const track = new Track({
      className: 'track'
    });
    const thumbs = {};
    const ranges = {};

    [
      'single',
      'first',
      'second'
    ].forEach((name) => {
      const thumb = track.addThumb({
        className: 'thumb'
      });

      thumb.addHint({
        className: 'hint'
      });
      thumb.onMouseOver = this._thumbOnMouseFactory('over', thumb);
      thumb.onMouseOut = this._thumbOnMouseFactory('out', thumb);

      thumbs[name] = thumb;
    });

    [
      'inner',
      'outer'
    ].forEach((name) => {
      ranges[name] = div(`range-${name}`); // TODO: make it clear
    });

    ranges.outer.append(ranges.inner);
    track.domElement.append(ranges.outer);

    const marks = track.addMarks({
      containerClassName: 'marks-container',
      markClassName: 'marks-entry'
    });

    root.addClass('rangeSliderContainer');
    track.appendTo(root);

    root.on(
      'mousedown',
      this._onMouseDown.bind(this)
    );
    track.domElement.on(
      'click',
      this._onMouseClick.bind(this)
    );

    this._track = track;
    this._thumbs = thumbs;
    this._ranges = ranges;
    this._marks = marks;

    this._onUpdate(initialState);
  }

  _onMouseDown(e) {
    e.preventDefault();

    const thumbs = Object.values(this._thumbs);

    const shouldCheck = thumbs.some((thumb) => {
      if (thumb.domElement[0] === e.target) {
        this._activeThumb = thumb;

        return true;
      }

      return false;
    });

    if (!shouldCheck) return;

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

  _onMouseClick(e) {
    e.preventDefault();

    if (this._state.range) {
      const { first, second } = this._thumbs;
      const portions = {
        first: first.getPortion(),
        second: second.getPortion(),
        pointer: this._track.getPointPortion(e)
      };

      if (portions.pointer < portions.first) {
        this._activeThumb = first;
      } else if (portions.pointer > portions.second) {
        this._activeThumb = second;
      } else {
        const diff = portions.second - portions.first;

        if (portions.pointer < portions.first + diff / 2) {
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

    const track = this._track;
    const thumbs = this._thumbs;
    const thumbsNames = Object.keys(thumbs);
    const portions = {};

    thumbsNames.forEach((name) => {
      portions[name] = thumbs[name].getPortion();
    });
    portions.pointer = track.getPointPortion(e);

    const { min, max, values } = this._state;

    let valueToSend;
    let valuesToSend = [];

    switch (this._activeThumb) {
      case thumbs.first: {
        if (portions.pointer > portions.second) {
          valuesToSend[0] = (values[1] - min) / (max - min);
          valuesToSend[1] = portions.pointer;

          this._activeThumb = thumbs.second;
        } else {
          valuesToSend = [portions.pointer, null];
        }
        break;
      }
      case thumbs.second: {
        if (portions.pointer < portions.first) {
          valuesToSend[0] = portions.pointer;
          valuesToSend[1] = (values[0] - min) / (max - min);

          this._activeThumb = thumbs.first;
        } else {
          valuesToSend = [null, portions.pointer];
        }
        break;
      }
      default: {
        valueToSend = portions.pointer;
      }
    }

    this._publishUpdate({
      value: valueToSend,
      values: valuesToSend
    });
  }

  _thumbOnMouseFactory(event, thumb) {
    const action = sswitch(event)({
      over: 'show',
      out: 'hide'
    });

    return (e) => {
      if (!e.forced && this._activeThumb) {
        return;
      }
      thumb.hint[action]();
    };
  }

  _onUpdate(data) {
    const thumbs = this._thumbs;
    const ranges = this._ranges;
    const track = this._track;
    const current = this._state;
    const {
      min,
      max,
      value,
      values,
      range,
      orientation,
      marks,
      hint
    } = data;

    const calcPortion = val => (
      (val - min) / (max - min)
    );

    const length = sswitch(orientation)({
      h: 'width',
      v: 'height'
    });

    if (orientation !== current.orientation) {
      this._updateOrientation(orientation);
    }
    if (!Model.isEqual(marks, current.marks)) {
      this._updateMarks({ marks, min, max });
    }
    this._updateHint({ hint, value, values });

    if (range) {
      thumbs.single.hide();
      thumbs.first.show();
      thumbs.second.show();
      ranges.inner.css('display', 'block');

      thumbs.first.setPortion(calcPortion(values[0]));
      thumbs.second.setPortion(calcPortion(values[1]));

      ranges.inner[length](
        calcPortion(values[0]) * track.length + track.thickness / 2
      );
      ranges.outer[length](
        calcPortion(values[1]) * track.length + track.thickness / 2
      );
    } else {
      thumbs.single.show();
      thumbs.first.hide();
      thumbs.second.hide();
      ranges.inner.css('display', 'none');

      thumbs.single.setPortion(calcPortion(value));

      ranges.outer[length](
        calcPortion(value) * track.length + track.thickness / 2
      );
    }

    this._state = data;
  }

  _updateOrientation(o) {
    const root = this._root;
    const track = this._track;

    root.removeClass('horizontal vertical');
    if (o === 'h') {
      root.addClass('horizontal');
      track.orientation = 'h';
    }
    if (o === 'v') {
      root.addClass('vertical');
      track.orientation = 'v';
    }
  }

  _updateMarks({ marks, min, max }) {
    this._marks.update({ marks, min, max });
  }

  _updateHint({ hint, value, values }) {
    const { single, first, second } = this._thumbs;
    const thumbs = [single, first, second];

    if (hint !== this._state.hint) {
      if (hint) {
        thumbs.forEach((thumb) => {
          thumb.hint.enable();
        });
      } else {
        thumbs.forEach((thumb) => {
          thumb.hint.disable();
        });
      }
    }

    if (hint) {
      single.hint.content = value;
      [first.hint.content, second.hint.content] = values;
    }
  }

  _publishUpdate(data) {
    this._publish('portionUpdate', data);
  }

  _attemptToHideHint(e) {
    const { pageX, pageY } = e;
    const thumb = this._activeThumb;

    if (!thumb.contains({ pageX, pageY })) {
      thumb.onMouseOut({ forced: true });
    }
  }

  set _activeThumb(thumb) {
    const obsoleteThumb = this._internalActiveThumb;

    if (thumb === null) {
      this._internalActiveThumb = null;

      return;
    }
    this._internalActiveThumb = thumb;

    if (!obsoleteThumb) return;

    obsoleteThumb.onMouseOut({ forced: true });
    thumb.onMouseOver({ forced: true });
  }

  get _activeThumb() {
    return this._internalActiveThumb;
  }
}
