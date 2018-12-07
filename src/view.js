// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import throttle from 'lodash.throttle';
import AbstractView from './abstract-view';
import './style.scss';

export default class View extends AbstractView {
  constructor(model, root, initialState) {
    super(model);

    this._track = $('<div class="track"></div>');
    this._thumb = $('<div class="thumb"></div>');

    root.addClass('rangeSliderContainer');
    root.append(this._track, this._thumb);

    this._thumbOnMouseDown = this._thumbOnMouseDown.bind(this);
    this._thumb.on('mousedown', this._thumbOnMouseDown);

    this._root = root;
    this._state = initialState;
    this._onUpdate(initialState);
  }

  _thumbOnMouseDown() {
    this._checkPointerAndSendUpdate = this._checkPointerAndSendUpdate.bind(this);

    const body = $(document.body);
    const throttledCheck = throttle(this._checkPointerAndSendUpdate, 100);

    body.on('mousemove', throttledCheck);

    body.one('mouseup', () => {
      body.off('mousemove', throttledCheck);
    });
  }

  _checkPointerAndSendUpdate(e) {
    let len;
    let portion;

    if (this._state.orientation === 'h') {
      len = e.pageX - this._trackInnerRadius - this._track.offset().left;
      portion = len / this._track.width();
    }
    if (this._state.orientation === 'v') {
      len = e.pageY - this._trackInnerRadius - this._track.offset().top;
      portion = len / this._track.height();
    }

    this._update({
      value: portion
    });
  }

  _onUpdate(data) {
    // TODO: marks, hint

    this._root.removeClass('horizontal vertical');
    if (data.orientation === 'h') {
      this._root.addClass('horizontal');
      this._trackInnerRadius = this._track.height() / 2;
    }
    if (data.orientation === 'v') {
      this._root.addClass('vertical');
      this._trackInnerRadius = this._track.width() / 2;
    }

    if (data.range) {
      // TODO: if range == true

    } else {
      const { min, max, value } = data;
      const portion = (value - min) / (max - min);

      if (data.orientation === 'h') {
        this._thumb.css('left', this._track.width() * portion);
      }
      if (data.orientation === 'v') {
        this._thumb.css('top', this._track.height() * portion);
      }
    }

    this._state = data;
  }

  _update(data) {
    this._publish('portionUpdate', data);
  }
}
