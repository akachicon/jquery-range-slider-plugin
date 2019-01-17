const $ = require('jquery');
const Line = require('./line').default;
const {
  instantiateEntity: instantiateLine,
  removeEntities: removeLines,
  test: testLine
} = require('../../../test/bem/entity')({
  Entity: Line,
  tagName: 'DIV',
  className: 'line'
});

const $body = $('body');

$body.width(400);
$body.height(200);

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
    test('which gets/sets the instance "$html" width in pct if "line_vertical" modifier is not applied', () => {
      const testVal = 25.5;
      const line = instantiateLine($body);

      line.lengthPct = testVal;

      expect(line.$html.css('width')).toBe(`${testVal}%`);
      expect(line.lengthPct).toBe(testVal);
    });

    test('which gets/sets the instance "$html" height in pct if "line_vertical" modifier is applied', () => {
      const testVal = 25.5;
      const line = instantiateLine($body);

      line.applyMod('line_vertical');
      line.lengthPct = testVal;

      expect(line.$html.css('height')).toBe(`${testVal}%`);
      expect(line.lengthPct).toBe(testVal);
    });

    test('which has a default value of 100', () => {
      const line = instantiateLine($body);

      expect(line.lengthPct).toBe(100);
      // jsdom does not support layout so there is no check for default styles
    });
  });

  describe('should expose lengthPx getter for the instance', () => {
    test('which gets the instance "$html" width in px if "line_vertical" modifier is not applied', () => {

    });

    test('which gets the instance "$html" height in px if "line_vertical" modifier is applied', () => {

    });
  });
});
