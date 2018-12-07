// eslint-disable-next-line import/no-extraneous-dependencies
import jQuery from 'jquery';
import deepCopy from 'deep-copy';
import rangeSlider from './range-slider';
import mergeSettings from './merge-settings';

let defaults = {
  min: 0,
  max: 100,
  step: 3,
  range: false,
  hint: false,
  orientation: 'h',
  value: 50,
  values: [30, 70],
  marks: {
    0: '0',
    50: 'default_mark',
    100: '100_super'
  },
  enabled: true
};

(($) => {
  // eslint-disable-next-line no-param-reassign
  $.fn.rangeSlider = function rangeSliderPlugin(options) {
    rangeSlider(mergeSettings(options, defaults, true), this);
  };

  Object.defineProperty($.fn.rangeSlider, 'defaults', {
    set(userDefaults) {
      defaults = mergeSettings(userDefaults, defaults);
    },

    get() {
      return deepCopy({}, defaults);
    }
  });
})(jQuery);
