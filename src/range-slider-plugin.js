// eslint-disable-next-line import/no-extraneous-dependencies
import jQuery from 'jquery';
import deepCopy from 'deep-copy';
import RangeSlider from './range-slider';
import Model from './model';

const defaults = {
  min: 0,
  max: 100,
  step: 5,
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
  $.fn.rangeSlider = function rangeSliderPlugin(...args) {
    const results = [];

    this.each(function callPlugin() {
      const $this = $(this);
      let plugin = $this.data('rangeSliderPlugin');

      if (!plugin) {
        const options = args[0] || {};

        plugin = new RangeSlider(Model.mergeSettings(options, defaults, true), $this);
        $this.data('rangeSliderPlugin', plugin);
        results.push($this);
      } else {
        if (!args[0]) return;

        const [command, options] = args;
        const commandResult = plugin[command](options);

        if (command === 'state') {
          results.push(commandResult);

          return;
        }
        results.push($this);
      }
    });

    return results;
  };

  Object.defineProperty($.fn.rangeSlider, 'defaults', {
    set(userDefaults) {
      Model.mergeSettings(userDefaults, defaults);
    },

    get() {
      return deepCopy({}, defaults);
    }
  });
})(jQuery);
