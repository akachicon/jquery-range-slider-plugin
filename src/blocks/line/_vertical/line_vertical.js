export default {
  apply() {
    const { $html, _lengthPct } = this;

    $html.css('width', '');
    $html.height(`${_lengthPct}%`);
  },
  remove() {
    const { $html, _lengthPct } = this;

    $html.css('height', '');
    $html.width(`${_lengthPct}%`);
  }
};
