export default {
  apply() {
    const { track, thumbs } = this;
    const { single, rangeFirst, rangeSecond } = thumbs;

    single.rangeSliderThumb.applyMod('range-slider__thumb_hidden');
    rangeFirst.rangeSliderThumb.removeMod('range-slider__thumb_hidden');
    rangeSecond.rangeSliderThumb.removeMod('range-slider__thumb_hidden');

    track.removeMod('track_empty');
    track.fillStartPortion = thumbs.rangeFirst.portion;
    track.fillEndPortion = thumbs.rangeSecond.portion;
  },
  remove() {
    this.track.applyMod('track_empty');
  }
};
