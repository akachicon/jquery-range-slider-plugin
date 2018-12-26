export default {
  apply() {
    Object.defineProperties(this, {
      length: {
        configurable: true,
        set(pixels) {
          this.$html.height(pixels);
        },
        get() {
          return this.$html.height();
        }
      },
      thickness: {
        configurable: true,
        get() {
          return this.$html.width();
        }
      }
    });

    this.$html.css('width', '');
  },

  remove() {
    delete this.length;
    delete this.thickness;

    this.$html.css('height', '');
  }
};
