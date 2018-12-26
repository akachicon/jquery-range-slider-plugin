export default {
  apply() {
    [
      this.path,
      this.fill.line,
      this.mask.line
    ].forEach((line) => {
      line.applyMod('line_vertical');
    });
  },
  remove() {
    [
      this.path,
      this.fill.line,
      this.mask.line
    ].forEach((line) => {
      debugger;

      line.removeMod('line_vertical');
    });
  }
};
