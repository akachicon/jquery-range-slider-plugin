// eslint-disable-next-line
import $ from 'jquery';
import style from './style.scss';

test('style mocks and jest works correctly', () => {
  $('<div/>', {
    id: 'range-slider',
    class: style.className,
  }).appendTo('body');

  const a = {
    x: 1,
    y: 2
  };

  const o = { ...a };

  expect($('#range-slider').attr('class')).toBe('className');
  expect(o.x).toBe(1);
});
