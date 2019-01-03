export default {
  apply() {
    const { track, thumbs } = this;

    track.applyMod('track_vertical');
    Object.values(thumbs)
      .forEach((thumb) => {
        thumb.circle.applyMod('circle_hint-position_left');
        thumb.rangeSliderThumb.applyMod('range-slider__thumb_vertical');
        // eslint-disable-next-line no-param-reassign
        thumb.portion = thumb._portion;
      });
  },
  remove() {
    const { track, thumbs } = this;

    track.removeMod('track_vertical');
    Object.values(thumbs)
      .forEach((thumb) => {
        thumb.circle.removeMod('circle_hint-position_left');
        thumb.rangeSliderThumb.removeMod('range-slider__thumb_vertical');
        // eslint-disable-next-line no-param-reassign
        thumb.portion = thumb._portion;
      });
  }
};
