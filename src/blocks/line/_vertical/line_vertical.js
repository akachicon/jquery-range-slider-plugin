export default {
  apply() {
    Object.defineProperties(this, {
      length: {
        set(pixels) {
          this.$html.height(pixels);
        },
        get() {
          return this.$html.height();
        }
      },
      thickness: {
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
