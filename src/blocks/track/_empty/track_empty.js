export default {
  apply() {
    this.fill.trackFiller.applyMod('track__filler_hidden');
  },
  remove() {
    this.fill.trackFiller.removeMod('track__filler_hidden');
  }
};
