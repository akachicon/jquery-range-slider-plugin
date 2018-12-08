// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import throttle from 'lodash.throttle';
import AbstractView from './abstract-view';
import './style.scss';

export default class View extends AbstractView {
  constructor(model, root, initialState) {
    super(model);

    const thumbs = ['_thumb', '_thumb01', '_thumb02'];

    this._track = $('<div class="track"><div class="range"></div></div>');
    this._range = this._track.find('.range');
    thumbs.forEach((thumb) => {
      this[thumb] = $('<div class="thumb"></div>');
    });

    root.addClass('rangeSliderContainer');
    root.append(
      this._track,
      this._range,
      thumbs.map(thumb => this[thumb])
    );

    thumbs.forEach(thumb => (
      this[thumb].on(
        'mousedown',
        this._thumbOnMouseDown.bind(this, thumb)
      )
    ));

    this._root = root;
    this._state = initialState;
    this._onUpdate(initialState);
  }

  _thumbOnMouseDown(thumb, e) {
    e.preventDefault();

    const body = $(document.body);
    const throttledCheck = throttle(
      this._checkPointerAndSendUpdate.bind(this),
      50
    );

    body.on('mousemove', throttledCheck);
    body.one('mouseup', () => {
      body.off('mousemove', throttledCheck);
      this._activeThumb = null;
    });

    this._activeThumb = thumb;
  }

  _checkPointerAndSendUpdate(e) {
    e.preventDefault();

    const thumb = this._activeThumb;

    let len;
    let portion;
    let portion01;
    let portion02;
    let value;
    let values;

    if (this._state.orientation === 'h') {
      len = e.pageX - this._thumbInnerRadius - this._track.offset().left;
      portion = len / this._track.width();

      portion01 = parseFloat(this._thumb01.css('left')) / this._track.width();
      portion02 = parseFloat(this._thumb02.css('left')) / this._track.width();
    }
    if (this._state.orientation === 'v') {
      len = e.pageY - this._thumbInnerRadius - this._track.offset().top;
      portion = len / this._track.height();

      portion01 = parseFloat(this._thumb01.css('top')) / this._track.height();
      portion02 = parseFloat(this._thumb02.css('top')) / this._track.height();
    }

    switch (thumb) {
      case '_thumb01':
        if (portion > portion01
            && portion > portion02) {
          values = [
            (this._state.values[1] - this._state.min) / (this._state.max - this._state.min),
            portion
          ];
          this._activeThumb = '_thumb02';
        } else {
          values = [portion, null];
        }
        break;

      case '_thumb02':
        if (portion < portion01
            && portion < portion02) {
          values = [
            portion,
            (this._state.values[0] - this._state.min) / (this._state.max - this._state.min)
          ];
          this._activeThumb = '_thumb01';
        } else {
          values = [null, portion];
        }
        break;

      default:
        value = portion;
    }

    this._update({
      value,
      values
    });
  }

  _onUpdate(data) {
    this._root.removeClass('horizontal vertical');
    if (data.orientation === 'h') {
      this._root.addClass('horizontal');
      this._thumbInnerRadius = this._track.height() / 2;
    }
    if (data.orientation === 'v') {
      this._root.addClass('vertical');
      this._thumbInnerRadius = this._track.width() / 2;
    }

    const setIndentation = (thumb, min, max, value) => {
      const portion = (value - min) / (max - min);

      if (data.orientation === 'h') {
        this[thumb].css('left', this._track.width() * portion);
      }
      if (data.orientation === 'v') {
        this[thumb].css('top', this._track.height() * portion);
      }
    };
    const { min, max } = data;

    if (data.range) {
      this._range.css('display', 'block');
      this._thumb.css('display', 'none');

      ['_thumb01', '_thumb02'].forEach(thumb => (
        this[thumb].css('display', 'block')
      ));

      ['_thumb01', '_thumb02'].forEach((thumb, i) => (
        setIndentation(thumb, min, max, data.values[i])
      ));

      const rangePortion = (this._state.values[1] - this._state.values[0])
        / (this._state.max - this._state.min);

      if (this._state.orientation === 'h') {
        this._range.css('left',
          (this._state.values[0] - this._state.min)
          / (this._state.max - this._state.min)
          * this._track.width()
          + this._thumb.width() / 2);
        this._range.width(rangePortion * this._track.width());
      }
      if (this._state.orientation === 'v') {
        this._range.height(rangePortion * this._track.height());
      }

    } else {
      this._range.css('display', 'none');
      this._thumb.css('display', 'block');

      ['_thumb01', '_thumb02'].forEach(thumb => (
        this[thumb].css('display', 'none')
      ));

      setIndentation('_thumb', min, max, data.value);
    }

    this._state = data;
  }

  _update(data) {
    this._publish('portionUpdate', data);
  }
}
