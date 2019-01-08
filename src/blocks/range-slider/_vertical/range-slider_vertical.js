export default {
  apply() {
    const { track, thumbs } = this;

    track.applyMod('track_vertical');
    Object.values(thumbs)
      .forEach((thumb) => {
        thumb.circle.applyMod('circle_hint-position_left');
        thumb.rangeSliderThumb.applyMod('range-slider__thumb_vertical');
        thumb.syncPortion();
      });
  },
  remove() {
    const { track, thumbs } = this;

    track.removeMod('track_vertical');
    Object.values(thumbs)
      .forEach((thumb) => {
        thumb.circle.removeMod('circle_hint-position_left');
        thumb.rangeSliderThumb.removeMod('range-slider__thumb_vertical');
        thumb.syncPortion();
      });
  }
};
