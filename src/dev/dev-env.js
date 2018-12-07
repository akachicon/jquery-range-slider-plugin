// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import '../range-slider-plugin';

$('body').append(`
    <div class="main">
        <div style="background: palegoldenrod">some space</div>
        <div id='rsh'></div>
        <div style="background: palegoldenrod">some space</div>
        <div id="rsv" style="height: 80px"></div>
        <div style="background: palegoldenrod">some space</div>
    </div>
`);

$.fn.rangeSlider.defaults = {
  min: -10,
  max: 10,
  step: 1,
  orientation: 'h',
  value: 0,
  values: [-15, 5],
  marks: {
    '-5': 'yes',
    0: { super: 'object' },
    101: 'excluded'
  }
};

$('#rsh').rangeSlider({});
$('#rsv').rangeSlider({ orientation: 'v' });

// function handleMouseMove(e) {
//   const { left } = e.data.track.offset();
//   const { thumb } = e.data;
//
//   thumb.css({ left: e.pageX - left });
//
//   console.log(e.pageX - left);
// }
//
// $('.rangeSliderContainer .thumb').on('mousedown', (e) => {
//   const t = $(e.target);
//
//   body.on('mousemove', {
//     track: t.parent().find('.track'),
//     thumb: t
//   }, handleMouseMove);
//   body.one('mouseup', () => {
//     body.off('mousemove', handleMouseMove);
//   });
// });
