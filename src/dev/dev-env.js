// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import '../range-slider-plugin';

$('body').append('<div>block</div>').rangeSlider({});


// $.fn.rangeSlider.defaults = {
//   min: 40,
//   max: 60,
//   step: 1.4,
//   orientation: 'h',
//   value: -1,
//   values: [0, 100],
//   marks: {
//     50: 'yes',
//     60: { super: 'svg' },
//     101: 'excluded'
//   }
// };

// const body = $('body');
//
// $('body').append(`
//     <div class="main">
//         <div style="background: palegoldenrod">some space</div>
//         <div class="rangeSliderContainer horizontal">
//             <div class="track"></div>
//             <div class="thumb"></div>
//         </div>
//         <div style="background: palegoldenrod">some space</div>
//         <div class="rangeSliderContainer vertical" style="height: 80px">
//             <div class="track"></div>
//             <div class="thumb"></div>
//         </div>
//         <div style="background: palegoldenrod">some space</div>
//     </div>
// `);
//
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
