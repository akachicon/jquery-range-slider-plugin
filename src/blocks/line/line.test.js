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
    describe('setter', () => {
      describe('line_vertical modifier is not applied', () => {
        test('should call the instance "$html.width" with a received argument concatenated with "%"', () => {
          const line = instantiateLine($body).entity;
          const htmlWidthSpy = jest.spyOn(line.$html, 'width');

          jest.spyOn(line, 'hasMod').mockImplementation(() => false);

          line.lengthPct = 15;
          expect(htmlWidthSpy).toHaveBeenLastCalledWith('15%');

          line.lengthPct = 110;
          expect(htmlWidthSpy).toHaveBeenLastCalledWith('110%');

          line.lengthPct = 0;
          expect(htmlWidthSpy).toHaveBeenLastCalledWith('0%');
        });
      });

      describe('line_vertical modifier is applied', () => {
        test('should call the instance "$html.height" with a received argument concatenated with "%"', () => {
          const line = instantiateLine($body).entity;
          const htmlHeightSpy = jest.spyOn(line.$html, 'height');

          jest.spyOn(line, 'hasMod').mockImplementation(() => true);

          line.lengthPct = 15;
          expect(htmlHeightSpy).toHaveBeenLastCalledWith('15%');

          line.lengthPct = 110;
          expect(htmlHeightSpy).toHaveBeenLastCalledWith('110%');

          line.lengthPct = 0;
          expect(htmlHeightSpy).toHaveBeenLastCalledWith('0%');
        });
      });
    });

    describe('getter', () => {
      test('should return a previously set value or the default value of 100', () => {
        const line = instantiateLine($body).entity;

        expect(line.lengthPct).toBe(100);

        line.lengthPct = 20;
        expect(line.lengthPct).toBe(20);

        line.lengthPct = 101;
        expect(line.lengthPct).toBe(101);
      });
    });
  });

  describe('should expose lengthPx getter for the instance', () => {
    describe('line_vertical modifier is not applied', () => {
      test('should return the result of the "$html.width" call', () => {
        const line = instantiateLine($body).entity;
        const htmlWidthSpy = jest.spyOn(line.$html, 'width');

        jest.spyOn(line, 'hasMod').mockImplementation(() => false);
        // eslint-disable-next-line no-unused-expressions
        line.lengthPx;

        expect(htmlWidthSpy).toHaveBeenLastCalledWith();
      });
    });

    describe('line_vertical modifier is applied', () => {
      test('shuold return the result of the "$html.height" call', () => {
        const line = instantiateLine($body).entity;
        const htmlHeightSpy = jest.spyOn(line.$html, 'height');

        jest.spyOn(line, 'hasMod').mockImplementation(() => true);
        // eslint-disable-next-line no-unused-expressions
        line.lengthPx;

        expect(htmlHeightSpy).toHaveBeenLastCalledWith();
      });
    });
  });

  describe('should expose thicknessPx getter for the instance', () => {
    describe('"line_vertical" modifier is not applied', () => {
      test('should return the result of the "$html.height" call', () => {
        const line = instantiateLine($body).entity;
        const htmlHeightSpy = jest.spyOn(line.$html, 'height');

        jest.spyOn(line, 'hasMod').mockImplementation(() => false);
        // eslint-disable-next-line no-unused-expressions
        line.thicknessPx;

        expect(htmlHeightSpy).toHaveBeenLastCalledWith();
      });
    });

    describe('"line_vertical" modifier is applied', () => {
      test('should return the result of the "$html.width" call', () => {
        const line = instantiateLine($body).entity;
        const htmlWidthSpy = jest.spyOn(line.$html, 'width');

        jest.spyOn(line, 'hasMod').mockImplementation(() => true);
        // eslint-disable-next-line no-unused-expressions
        line.thicknessPx;

        expect(htmlWidthSpy).toHaveBeenLastCalledWith();
      });
    });
  });
});
