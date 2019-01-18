const $ = require('jquery');
const Line = require('./line').default;
const {
  instantiateEntity: instantiateLine,
  removeEntities: removeLines,
  test: testLine
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
        const line = instantiateLine($body);
        const widthSpy = jest.spyOn(line.$html, 'width');

        line.lengthPct = 15;
        expect(widthSpy).toHaveBeenCalledWith('15%');
        expect(widthSpy).toHaveBeenCalledTimes(1);

        widthSpy.mockClear();
        line.lengthPct = 110;
        expect(widthSpy).toHaveBeenCalledWith('110%');
        expect(widthSpy).toHaveBeenCalledTimes(1);

        widthSpy.mockClear();
        line.lengthPct = 0;
        expect(widthSpy).toHaveBeenCalledWith('0%');
        expect(widthSpy).toHaveBeenCalledTimes(1);
      });

      test('the getter returns previously set value or the default value of 100', () => {
        const line = instantiateLine($body);

        expect(line.lengthPct).toBe(100);

        line.lengthPct = 20;
        expect(line.lengthPct).toBe(20);

        line.applyMod('line_vertical');
        line.lengthPct = 101;
        line.removeMod('line_vertical');
        expect(line.lengthPct).toBe(101);
      });
    });

    describe('in case "line_vertical" modifier is applied', () => {
      test('the setter calls "$html.height" with a received argument concatenated with "%"', () => {
        const line = instantiateLine($body);
        const heightSpy = jest.spyOn(line.$html, 'height');

        line.applyMod('line_vertical');

        heightSpy.mockClear();
        line.lengthPct = 15;
        expect(heightSpy).toHaveBeenCalledWith('15%');
        expect(heightSpy).toHaveBeenCalledTimes(1);

        heightSpy.mockClear();
        line.lengthPct = 110;
        expect(heightSpy).toHaveBeenCalledWith('110%');
        expect(heightSpy).toHaveBeenCalledTimes(1);

        heightSpy.mockClear();
        line.lengthPct = 0;
        expect(heightSpy).toHaveBeenCalledWith('0%');
        expect(heightSpy).toHaveBeenCalledTimes(1);
      });

      test('the getter returns previously set value or the default value of 100', () => {
        const line = instantiateLine($body);

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
        const line = instantiateLine($body);
        const widthSpy = jest.spyOn(line.$html, 'width');

        // eslint-disable-next-line no-unused-expressions
        line.lengthPx;

        expect(widthSpy).toHaveBeenCalledWith();
        expect(widthSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('in case "line_vertical" modifier is applied', () => {
      test('the getter returns the result of the "$html.height" call', () => {
        const line = instantiateLine($body);
        const heightSpy = jest.spyOn(line.$html, 'height');

        line.applyMod('line_vertical');
        heightSpy.mockClear();
        // eslint-disable-next-line no-unused-expressions
        line.lengthPx;

        expect(heightSpy).toHaveBeenCalledWith();
        expect(heightSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('should expose thicknessPx getter for the instance', () => {
    describe('in case "line_vertical" modifier is not applied', () => {
      test('the getter returns the result of the "$html.height" call', () => {
        const line = instantiateLine($body);
        const heightSpy = jest.spyOn(line.$html, 'height');

        line.applyMod('line_vertical');
        heightSpy.mockClear();
        // eslint-disable-next-line no-unused-expressions
        line.lengthPx;

        expect(heightSpy).toHaveBeenCalledWith();
        expect(heightSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('in case "line_vertical" modifier is applied', () => {
      test('the getter returns the result of the "$html.width" call', () => {
        const line = instantiateLine($body);
        const widthSpy = jest.spyOn(line.$html, 'width');

        // eslint-disable-next-line no-unused-expressions
        line.lengthPx;

        expect(widthSpy).toHaveBeenCalledWith();
        expect(widthSpy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
