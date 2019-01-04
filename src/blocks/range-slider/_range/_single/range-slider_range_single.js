export default {
  apply() {
    const { track, thumbs } = this;
    const { single, rangeFirst, rangeSecond } = thumbs;

    single.rangeSliderThumb.removeMod('range-slider__thumb_hidden');
    rangeFirst.rangeSliderThumb.applyMod('range-slider__thumb_hidden');
    rangeSecond.rangeSliderThumb.applyMod('range-slider__thumb_hidden');

    track.removeMod('track_empty');
    track.fillStartPortion = null;
    track.fillEndPortion = thumbs.single.portion;
  },
  remove() {
    this.track.applyMod('track_empty');
  }
};
