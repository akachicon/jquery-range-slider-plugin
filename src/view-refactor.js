// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import throttle from 'lodash.throttle';
import Model from './model';
import AbstractView from './abstract-view';
import './style.scss';

const POINTER_CHECK_INTERVAL = 50;

export default class View extends AbstractView {
  constructor(model, root, initialState) {
    super(model);

    this._model = model;
    this._$root = root;
    this._state = {};

    const div = className => (
      $(`<div class="${className}"></div>`)
    );

    this._track = div('track');

    this._ranges = {};
    [
      'inner',
      'outer'
    ].forEach((name) => {
      this._ranges[name] = div(`range-${name}`);
    });

    this._ranges.outer.append(this._ranges.inner);
    this._track.append(this._ranges.outer);

    const thumbNames = [
      'single',
      'rangeFirst',
      'rangeSecond'
    ];
    this._thumbs = {};
    thumbNames.forEach((name) => {
      this._thumbs[name] = div('thumb');
    });

    this._$root.addClass('rangeSliderContainer');
    this._$root.append(
      this._track,
      thumbNames.map(name => this._thumbs[name])
    );

    this._$root.on(
      'mousedown',
      this._onMouseDown.bind(this)
    );
    this._track.on(
      'click',
      this._onMouseClick.bind(this)
    );

    this._marks = [];

    this._onUpdate(initialState);
  }

  _onMouseDown(e) {
    e.preventDefault();

    const thumbNames = Object.keys(this._thumbs);

    const shouldCheck = thumbNames.some((name) => {
      if (this._thumbs[name][0] === e.target) {
        this._activeThumbName = name;

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
    body.one('mouseup', () => {
      body.off('mousemove', throttledCheck);
      this._activeThumbName = null;
    });
  }

  _onMouseClick(e) {
    e.preventDefault();


  }

  _checkPointerAndSendUpdate(e) {
    e.preventDefault();

    const portionNames = ['pointer', 'rangeFirst', 'rangeSecond'];
    const portions = this._calculatePortions(
      portionNames,
      this._state.orientation,
      e
    );

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
      parseFloat(this._thumbs[name].css(prop))
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
    const {
      min,
      max,
      value,
      values,
      range,
      orientation: o,
      marks
    } = data;

    if (o !== this._state.orientation) {
      this._changeOrientation(o);
    }

    if (!Model.isEqual(marks, this._state.marks)) {
      this._changeMarks(marks, min, max, o);
    }

    const display = (category, config) => {
      Object.keys(config).forEach((name) => {
        category[name].css('display', config[name]);
      });
    };

    const trackLength = {
      h: this._track.width(),
      v: this._track.height()
    };
    const thumbRadius = {
      h: trackLength.v / 2,
      v: trackLength.h / 2
    };

    let lengthProp;

    if (o === 'h') {
      lengthProp = 'width';
    }
    if (o === 'v') {
      lengthProp = 'height';
    }

    if (range) {
      const rangePortions = {
        inner: (values[0] - min) / (max - min),
        outer: (values[1] - min) / (max - min)
      };

      display(this._thumbs, {
        single: 'none',
        rangeFirst: 'block',
        rangeSecond: 'block'
      });
      display(this._ranges, {
        inner: 'block',
        outer: 'block'
      });

      this._setThumbIndentation('rangeFirst', values[0], min, max, o);
      this._setThumbIndentation('rangeSecond', values[1], min, max, o);

      ['inner', 'outer'].forEach((name) => {
        this._ranges[name][lengthProp](
          rangePortions[name] * trackLength[o] + thumbRadius[o]
        );
      });
    } else {
      const rangePortion = (value - min) / (max - min);

      display(this._thumbs, {
        single: 'block',
        rangeFirst: 'none',
        rangeSecond: 'none'
      });
      display(this._ranges, {
        inner: 'none'
      });

      this._setThumbIndentation('single', value, min, max, o);

      this._ranges.outer[lengthProp](
        rangePortion * trackLength[o] + thumbRadius[o]
      );
    }

    this._state = data;
  }

  _changeOrientation(o) {
    const root = this._$root;

    root.removeClass('horizontal vertical');
    if (o === 'h') {
      root.addClass('horizontal');
    }
    if (o === 'v') {
      root.addClass('vertical');
    }
  }

  _changeMarks(marks, min, max, o) {
    const trackLength = {
      h: this._track.width(),
      v: this._track.height()
    };
    const thumbRadius = {
      h: trackLength.v / 2,
      v: trackLength.h / 2
    };

    const removeAllMarks = () => {
      this._marks.forEach((mark) => {
        // dom handling
      });
    };

    const getIndentation = value => (
      (value - min) / (max - min) * trackLength[o]
    );

    const marksPositions = Object.keys(marks);
    const spans = [];

    if (!marksPositions.length) {
      removeAllMarks();
    }

    marksPositions.forEach((position) => {
      const indent = getIndentation(+position);
      let newMark;

      if (o === 'h') {
        newMark = `
          <span 
            style="
              display: inline-block;
              left:${indent + thumbRadius[o]}px; 
              position: absolute;
              text-align: center;
              transform: translate(-50%);
            "
          >
            ${marks[position]}
          </span>`;
      }
      if (o === 'v') {
        newMark = `
          <span 
            style="
              display: inline-block;
              top:${indent + thumbRadius[o]}px; 
              position: absolute;
              left: ${thumbRadius.v * 2}px;
              transform: translate(.5em, -50%);
            "
          >
            ${marks[position]}
          </span>`;
      }

      spans.push(newMark);
    });

    this._$root.append(spans.join(''));
  }

  _setThumbIndentation(thumbName, val, min, max, orientation) {
    const thumb = this._thumbs[thumbName];
    const portion = (val - min) / (max - min);

    let lengthProp;
    let indentProp;

    if (orientation === 'h') {
      lengthProp = 'width';
      indentProp = 'left';
    }
    if (orientation === 'v') {
      lengthProp = 'height';
      indentProp = 'top';
    }

    thumb.css(
      indentProp,
      portion * this._track[lengthProp]()
    );
  }

  _publishUpdate(data) {
    this._publish('portionUpdate', data);
  }
}
