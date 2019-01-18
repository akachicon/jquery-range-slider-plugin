export default {
  apply() {
    const { $html, lengthPct } = this;

    $html.css('width', '');
    $html.height(`${lengthPct}%`);
  },
  remove() {
    const { $html, lengthPct } = this;

    $html.css('height', '');
    $html.width(`${lengthPct}%`);
  }
};
