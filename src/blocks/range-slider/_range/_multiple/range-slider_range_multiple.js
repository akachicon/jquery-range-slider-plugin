export default {
  apply() {
    const { track, thumbs } = this;
    const { single, rangeFirst, rangeSecond } = thumbs;

    single.rangeSliderThumb.applyMod('range-slider__thumb_hidden');
    rangeFirst.rangeSliderThumb.removeMod('range-slider__thumb_hidden');
    rangeSecond.rangeSliderThumb.removeMod('range-slider__thumb_hidden');

    track.fillStartPortion = rangeFirst.portion;
    track.fillEndPortion = rangeSecond.portion;
  },
  remove() {
    const { track, thumbs } = this;
    const { single, rangeFirst, rangeSecond } = thumbs;

    single.rangeSliderThumb.removeMod('range-slider__thumb_hidden');
    rangeFirst.rangeSliderThumb.applyMod('range-slider__thumb_hidden');
    rangeSecond.rangeSliderThumb.applyMod('range-slider__thumb_hidden');

    track.fillStartPortion = null;
    track.fillEndPortion = single.portion;
  }
};
