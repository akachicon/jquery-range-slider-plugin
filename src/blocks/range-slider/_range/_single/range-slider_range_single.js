export default {
  apply() {
    const { track, thumbs } = this;
    const { single, rangeFirst, rangeSecond } = thumbs;

    single.rangeSliderThumb.removeMod('range-slider__thumb_hidden');
    rangeFirst.rangeSliderThumb.applyMod('range-slider__thumb_hidden');
    rangeSecond.rangeSliderThumb.applyMod('range-slider__thumb_hidden');

    track.fillStartPortion = null;
    track.fillEndPortion = thumbs.single.portion;
  },
  remove() {}
};
