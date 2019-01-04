export default {
  apply() {
    this._hidden = this.$html.detach();
  },
  remove() {
    if (!this._hidden) return;

    this._hidden.appendTo(this.$parent);
    this._hidden = null;
  }
};
