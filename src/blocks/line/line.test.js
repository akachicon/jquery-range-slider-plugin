const $ = require('jquery');
const Line = require('./line').default;
const {
  instantiateEntity: instantiateLine,
  removeEntities: removeLines,
  testEntity: testLine
} = require('../../../test/bem/entity')({
  Entity: Line,
  expected: {
    tagName: 'DIV',
    className: 'line'
  }
});

const $body = $('body');

describe('Line class', () => {
  beforeEach(() => {
    removeLines();
  });

  test('should extend Modifiable', () => {
    testLine.doesExtendModifiable();
  });

  describe('should call a passed first arg function in the constructor', () => {
    test('with a jquery div element', () => {
      testLine.doesConformToTagName();
    });

    test('with a jquery element that has class "line"', () => {
      testLine.doesConformToClassName();
    });
  });

  describe('should expose lengthPct getter/setter for the instance', () => {
    describe('in case "line_vertical" modifier is not applied', () => {
      test('the setter calls "$html.width" with a received argument concatenated with "%"', () => {
        const line = instantiateLine($body).entity;
        const htmlWidthSpy = jest.spyOn(line.$html, 'width');

        line.lengthPct = 15;
        expect(htmlWidthSpy).toHaveBeenCalledWith('15%');
        expect(htmlWidthSpy).toHaveBeenCalledTimes(1);

        htmlWidthSpy.mockClear();
        line.lengthPct = 110;
        expect(htmlWidthSpy).toHaveBeenCalledWith('110%');
        expect(htmlWidthSpy).toHaveBeenCalledTimes(1);

        htmlWidthSpy.mockClear();
        line.lengthPct = 0;
        expect(htmlWidthSpy).toHaveBeenCalledWith('0%');
        expect(htmlWidthSpy).toHaveBeenCalledTimes(1);
      });

      test('the getter returns previously set value or the default value of 100', () => {
        const line = instantiateLine($body).entity;

        expect(line.lengthPct).toBe(100);

        line.lengthPct = 20;
        expect(line.lengthPct).toBe(20);

        line.applyMod('line_vertical'); // TODO: consider mock of the 'hasMod' method
        line.lengthPct = 101;
        line.removeMod('line_vertical');
        expect(line.lengthPct).toBe(101);
      });
    });

    describe('in case "line_vertical" modifier is applied', () => {
      test('the setter calls "$html.height" with a received argument concatenated with "%"', () => {
        const line = instantiateLine($body).entity;
        const htmlHeightSpy = jest.spyOn(line.$html, 'height');

        line.applyMod('line_vertical');

        htmlHeightSpy.mockClear();
        line.lengthPct = 15;
        expect(htmlHeightSpy).toHaveBeenCalledWith('15%');
        expect(htmlHeightSpy).toHaveBeenCalledTimes(1);

        htmlHeightSpy.mockClear();
        line.lengthPct = 110;
        expect(htmlHeightSpy).toHaveBeenCalledWith('110%');
        expect(htmlHeightSpy).toHaveBeenCalledTimes(1);

        htmlHeightSpy.mockClear();
        line.lengthPct = 0;
        expect(htmlHeightSpy).toHaveBeenCalledWith('0%');
        expect(htmlHeightSpy).toHaveBeenCalledTimes(1);
      });

      test('the getter returns previously set value or the default value of 100', () => {
        const line = instantiateLine($body).entity;

        line.applyMod('line_vertical');
        expect(line.lengthPct).toBe(100);

        line.lengthPct = 20;
        expect(line.lengthPct).toBe(20);

        line.removeMod('line_vertical');
        line.lengthPct = 101;
        line.applyMod('line_vertical');
        expect(line.lengthPct).toBe(101);
      });
    });
  });

  describe('should expose lengthPx getter for the instance', () => {
    describe('in case "line_vertical" modifier is not applied', () => {
      test('the getter returns the result of the "$html.width" call', () => {
        const line = instantiateLine($body).entity;
        const htmlWidthSpy = jest.spyOn(line.$html, 'width');

        // eslint-disable-next-line no-unused-expressions
        line.lengthPx;

        expect(htmlWidthSpy).toHaveBeenCalledWith();
        expect(htmlWidthSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('in case "line_vertical" modifier is applied', () => {
      test('the getter returns the result of the "$html.height" call', () => {
        const line = instantiateLine($body).entity;
        const htmlHeightSpy = jest.spyOn(line.$html, 'height');

        line.applyMod('line_vertical');
        htmlHeightSpy.mockClear();
        // eslint-disable-next-line no-unused-expressions
        line.lengthPx;

        expect(htmlHeightSpy).toHaveBeenCalledWith();
        expect(htmlHeightSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('should expose thicknessPx getter for the instance', () => {
    describe('in case "line_vertical" modifier is not applied', () => {
      test('the getter returns the result of the "$html.height" call', () => {
        const line = instantiateLine($body).entity;
        const htmlHeightSpy = jest.spyOn(line.$html, 'height');

        line.applyMod('line_vertical');
        htmlHeightSpy.mockClear();
        // eslint-disable-next-line no-unused-expressions
        line.lengthPx;

        expect(htmlHeightSpy).toHaveBeenCalledWith();
        expect(htmlHeightSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('in case "line_vertical" modifier is applied', () => {
      test('the getter returns the result of the "$html.width" call', () => {
        const line = instantiateLine($body).entity;
        const htmlWidthSpy = jest.spyOn(line.$html, 'width');

        // eslint-disable-next-line no-unused-expressions
        line.lengthPx;

        expect(htmlWidthSpy).toHaveBeenCalledWith();
        expect(htmlWidthSpy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
