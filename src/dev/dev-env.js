// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import '../range-slider-plugin';

$('body').append(`
    <div class="main">
        <div style="background: palegoldenrod">some space</div>
        <div id='rsh'></div>
        <div style="background: palegoldenrod">some space</div>
        <div id="rsh01"></div>
        <div style="background: palegoldenrod">some space</div>
        <div id="rsv" style="display: inline-block; height: 400px;"></div>
        <div id="rsv01" style="display: inline-block; height: 400px; margin-left: 30px"></div>
    </div>
`);

$.fn.rangeSlider.defaults = {
  min: -10,
  max: 10,
  step: 0.1,
  orientation: 'h',
  range: true,
  value: 0,
  values: [-5, 5],
  marks: {
    '-10': { label: 'start', classList: 'custom-mark' },
    '-5': 'yes',
    0: `<svg width="16" height="16">
         <circle cx="8" cy="8" r="8" stroke="red" stroke-width="2" fill="yellow" />
         Sorry, your browser does not support inline SVG.
        </svg> `,
    10: 'enduuuuuuuuuuum',
    11: 'excluded'
  }
};

$('#rsh').rangeSlider({ range: false });
$('#rsh01').rangeSlider({});
$('#rsv').rangeSlider({ orientation: 'v', range: false });
$('#rsv01').rangeSlider({ orientation: 'v' });
