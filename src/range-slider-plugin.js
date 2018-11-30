// eslint-disable-next-line import/no-extraneous-dependencies
import jQuery from 'jquery';
import rangeSlider from './range-slider';
import refineIncomingDefaults from './defaults-refiners';

let defaults = {
  min: 0,
  max: 100,
  step: 1,
  range: false,
  hint: false,
  orientation: 'h',
  value: 50,
  values: [30, 70],
  marks: {
    0: '0',
    50: 'default_mark',
    100: '100_super'
  }
};

(($) => {
  // eslint-disable-next-line no-param-reassign
  $.fn.rangeSlider = function (options) {
    rangeSlider.call(this, defaults, options);
  };

  Object.defineProperty($.fn.rangeSlider, 'defaults', {
    set(userDefaults) {
      const newDefaults = refineIncomingDefaults(userDefaults, defaults);

      defaults = $.extend({}, { // to prevent changing of the defaults from the rangeSlider code
        ...defaults,
        ...newDefaults
      });
    },

    get() {
      return $.extend({}, defaults); // to prevent changing of the defaults from the outside code
    }
  });
})(jQuery);
