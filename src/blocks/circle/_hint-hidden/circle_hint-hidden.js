export default {
  apply() {
    this.hint.circleHint.applyMod('circle__hint_hidden');
  },
  remove() {
    this.hint.circleHint.removeMod('circle__hint_hidden');
  }
};
