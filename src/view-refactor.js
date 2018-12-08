// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import throttle from 'lodash.throttle';
import AbstractView from './abstract-view';
import './style.scss';

const POSITION_CHECK_INTERVAL = 50;

export default class View extends AbstractView {
  constructor(model, root, initialState) {
    super(model);

    this._model = model;
    this._root = root;
    this._state = {};

    const div = className => (
      $(`<div class="${className}"></div>`)
    );

    this._track = div('track');
    this._rangeFirst = div('range-first');
    this._rangeSecond = div('range-second');

    this._rangeSecond.append(this._rangeFirst);
    this._track.append(this._rangeSecond);

    this._thumbs = {};
    [
      'single',
      'rangeFirst',
      'rangeSecond'
    ].forEach((name) => {
      this._thumbs[name] = div('thumb');
    });

    const thumbNames = Object.keys(this._thumbs);

    this._root.addClass('rangeSliderContainer');
    this._root.append(
      this._track,
      thumbNames.map(name => this._thumbs[name])
    );

    this._root.on(
      'mousedown',
      this._onMouseDown.bind(this)
    );

    this._onUpdate(initialState);
  }

  _onMouseDown(e) {
    e.preventDefault();

    const thumbNames = Object.keys(this._thumbs);

    thumbNames.some((name) => {
      if (this._thumbs[name][0] === e.target) {
        this._activeThumbName = name;

        return true;
      }
      return false;
    });

    const body = $(document.body);
    const throttledCheck = throttle(
      this._checkPointerAndSendUpdate.bind(this),
      POSITION_CHECK_INTERVAL
    );

    body.on('mousemove', throttledCheck);
    body.one('mouseup', () => {
      body.off('mousemove', throttledCheck);
      this._activeThumbName = null;
    });
  }

  _checkPointerAndSendUpdate(e) {
    e.preventDefault();

    const portionNames = ['pointer', 'rangeFirst', 'rangeSecond'];
    let portions;

    if (this._state.orientation === 'h') {
      portions = this._calculatePortions(portionNames, 'h', e);
    }
    if (this._state.orientation === 'v') {
      portions = this._calculatePortions(portionNames, 'v', e);
    }

    const {
      rangeFirst: rfPortion,
      rangeSecond: rsPortion,
      pointer: pointerPortion
    } = portions;
    const { min, max, values } = this._state;

    let valueToSend;
    let valuesToSend = [];

    switch (this._activeThumbName) {
      case 'rangeFirst':
        if (pointerPortion > rfPortion
            && pointerPortion > rsPortion) {
          valuesToSend[0] = (values[1] - min) / (max - min);
          valuesToSend[1] = pointerPortion;

          this._activeThumbName = 'rangeSecond';
        } else {
          valuesToSend = [pointerPortion, null];
        }
        break;

      case 'rangeSecond':
        if (pointerPortion < rfPortion
            && pointerPortion < rsPortion) {
          valuesToSend[0] = pointerPortion;
          valuesToSend[1] = (values[0] - min) / (max - min);

          this._activeThumbName = 'rangeFirst';
        } else {
          valuesToSend = [null, pointerPortion];
        }
        break;

      default:
        valueToSend = pointerPortion;
    }

    this._publishUpdate({
      value: valueToSend,
      values: valuesToSend
    });
  }

  _calculatePortions(portionNames, orientation, pointerPageXY = {}) {
    const { pageX, pageY } = pointerPageXY;
    const trackStart = {
      h: this._track.offset().left,
      v: this._track.offset().top
    };
    const trackLength = {
      h: this._track.width(),
      v: this._track.height()
    };
    const thumbInnerRadius = {
      h: trackLength.v / 2,
      v: trackLength.h / 2
    };

    // eslint-disable-next-line no-shadow
    const computedThumbCss = (name, prop) => (
      parseFloat(this._thumbs[name].css(prop)) // TODO: this._thumbs
    );

    const calculatePortion = (o, portionName) => {
      let pointerPosition;
      let indentDirection;

      if (o === 'h') {
        pointerPosition = pageX;
        indentDirection = 'left';
      }
      if (o === 'v') {
        pointerPosition = pageY;
        indentDirection = 'top';
      }

      if (portionName === 'pointer') {
        return (pointerPosition - trackStart[o] - thumbInnerRadius[o]) / trackLength[o];
      }

      return computedThumbCss(portionName, indentDirection) / trackLength[o];
    };

    const portions = {};

    // eslint-disable-next-line array-callback-return
    portionNames.forEach((name) => {
      portions[name] = calculatePortion(orientation, name);
    });

    return portions;
  }

  _onUpdate(data) {
    if (data.orientation !== this._state.orientation) {
      this._updateOrientation(data.orientation);
    }

    const displayThumbs = (thumbNames) => {
      Object.keys(thumbNames).forEach((name) => {
        this._thumbs[name].css('display', thumbNames[name]);
      });
    };

    const {
      min,
      max,
      value,
      values
    } = data;

    const setIndentation = (item, val) => {
      const portion = (val - min) / (max - min);

      let prop;
      let indentProp;

      if (data.orientation === 'h') {
        prop = 'width';
        indentProp = 'left';
      }
      if (data.orientation === 'v') {
        prop = 'height';
        indentProp = 'top';
      }

      item.css(
        indentProp,
        portion * this._track[prop]()
      );
    };

    if (data.range) {
      displayThumbs({
        single: 'none',
        rangeFirst: 'block',
        rangeSecond: 'block'
      });
      this._rangeFirst.css('display', 'block');
      this._rangeSecond.css('display', 'block');

      const thumbFirst = this._thumbs.rangeFirst;
      const thumbSecond = this._thumbs.rangeSecond;

      setIndentation(thumbFirst, values[0]);
      setIndentation(thumbSecond, values[1]);

      const portionFirst = (values[0] - min) / (max - min);
      const portionSecond = (values[1] - min) / (max - min);

      const thumbRadius = {
        h: this._track.height() / 2,
        v: this._track.width() / 2
      };

      if (data.orientation === 'h') {
        this._rangeFirst.width(portionFirst * this._track.width() + thumbRadius.h);
        this._rangeSecond.width(portionSecond * this._track.width() + thumbRadius.h);
      }
      if (data.orientation === 'v') {
        this._rangeFirst.height(portionFirst * this._track.height() + thumbRadius.v);
        this._rangeSecond.height(portionSecond * this._track.height() + thumbRadius.v);
      }
    } else {
      displayThumbs({
        single: 'block',
        rangeFirst: 'none',
        rangeSecond: 'none'
      });
      this._range.css('display', 'none');

      setIndentation('single', value);
    }

    this._state = data;
  }

  _updateOrientation(o) {
    const root = this._root;

    root.removeClass('horizontal vertical');
    if (o === 'h') {
      root.addClass('horizontal');
    }
    if (o === 'v') {
      root.addClass('vertical');
    }
  }

  _publishUpdate(data) {
    this._publish('portionUpdate', data);
  }
}
