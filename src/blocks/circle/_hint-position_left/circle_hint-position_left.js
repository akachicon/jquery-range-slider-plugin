export default {
  apply() {
    this.hint.hint.applyMod('hint_left');
    this.hint.circleHint.applyMod('circle__hint_left');
  },
  remove() {
    this.hint.hint.removeMod('hint_left');
    this.hint.circleHint.removeMod('circle__hint_left');
  }
};
