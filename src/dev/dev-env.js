// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import '../range-slider-plugin';

$('body').append(`
    <div class="main">
        <div style="background: palegoldenrod">some space</div>
        <div id='rsh'></div>
        <div style="background: palegoldenrod">some space</div>
        <div id="rsh01"></div>
        <div id="rsh02"></div>
        <div id="rsh03"></div>
        <div id="rsv" style="height: 400px; width: 50px"></div>
        <div style="background: palegoldenrod">some space</div>
    </div>
`);

$.fn.rangeSlider.defaults = {
  min: -10,
  max: 10,
  step: 0.001,
  orientation: 'h',
  range: true,
  value: 0,
  values: [-5, 5],
  marks: {
    '-5': 'yes',
    0: { super: 'object' },
    101: 'excluded'
  }
};

$('#rsh').rangeSlider({});
$('#rsh01').rangeSlider({ orientation: 'h' });
$('#rsh02').rangeSlider({ orientation: 'h' });
$('#rsh03').rangeSlider({ orientation: 'h' });
$('#rsv').rangeSlider({ orientation: 'v' });
