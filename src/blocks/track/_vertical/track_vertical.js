export default {
  apply() {
    const { $html, path, fill } = this;

    $html.css('width', '');
    $html.height('100%');
    path.applyMod('line_vertical');
    fill.line.applyMod('line_vertical');
    fill.trackFiller.applyMod('track__filler_vertical');
  },
  remove() {
    const { $html, path, fill } = this;

    $html.width('100%');
    $html.css('height', '');
    path.removeMod('line_vertical');
    fill.line.removeMod('line_vertical');
    fill.trackFiller.removeMod('track__filler_vertical');
  }
};
