export default {
  apply() {
    const { path, fill } = this;

    path.line.applyMod('line_vertical');
    fill.line.applyMod('line_vertical');
    fill.trackFiller.applyMod('track__filler_vertical');

    this.fillStartPortion = this._fillStartPortion; // TODO: syncFillStartPortion()
  },
  remove() {
    const { path, fill } = this;

    path.line.removeMod('line_vertical');
    fill.line.removeMod('line_vertical');
    fill.trackFiller.removeMod('track__filler_vertical');

    this.fillStartPortion = this._fillStartPortion;
  }
};
