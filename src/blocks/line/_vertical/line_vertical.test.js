const $ = require('jquery');
const Line = require('../line').default;
const lineVertical = require('./line_vertical').default;
const {
  instantiateEntity: instantiateLine,
  removeEntities: removeLines,
  applyMod,
  removeMod
} = require('../../../../test/bem/entity')({
  Entity: Line
});

const $body = $('body');

describe('line_vertical modifier', () => {
  beforeEach(() => {
    removeLines();
  });

  describe('when is being applied', () => {
    test('should call the instance "$html.css" prop with ("width", "") args', () => {
      const line = instantiateLine($body);
      const cssSpy = jest.spyOn(line.$html, 'css');

      applyMod(line, lineVertical);

      expect(cssSpy).toHaveBeenCalledWith('width', '');
      expect(cssSpy).toHaveBeenCalledTimes(1);
    });

    test('should call the instance "$html.height" prop with the "lengthPct" value concatenated with "%" as an arg', () => {
      const line = instantiateLine($body);
      const heightSpy = jest.spyOn(line.$html, 'height');

      line.lengthPct = 9.01;
      applyMod(line, lineVertical);

      expect(heightSpy).toHaveBeenCalledWith(`${line.lengthPct}%`);
      expect(heightSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('when is being removed', () => {
    test('should call the instance "$html.css" prop with ("height", "") args', () => {
      const line = instantiateLine($body);
      const cssSpy = jest.spyOn(line.$html, 'css');

      applyMod(line, lineVertical);
      cssSpy.mockClear();
      removeMod(line, lineVertical);

      expect(cssSpy).toHaveBeenCalledWith('height', '');
      expect(cssSpy).toHaveBeenCalledTimes(1);
    });

    test('should call the instance "$html.width" prop with the "lengthPct" value concatenated with "%" as an arg', () => {
      const line = instantiateLine($body);
      const widthSpy = jest.spyOn(line.$html, 'width');

      lineVertical.apply.call(line);
      line.lengthPct = 9.01;
      widthSpy.mockClear();
      lineVertical.remove.call(line);

      expect(widthSpy).toHaveBeenCalledWith(`${line.lengthPct}%`);
      expect(widthSpy).toHaveBeenCalledTimes(1);
    });
  });
});
