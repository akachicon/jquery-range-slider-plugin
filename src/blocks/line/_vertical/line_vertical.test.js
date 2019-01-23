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
      const line = instantiateLine($body).entity;
      const htmlCssSpy = jest.spyOn(line.$html, 'css');

      applyMod(line, lineVertical);

      expect(htmlCssSpy).toHaveBeenCalledWith('width', '');
      expect(htmlCssSpy).toHaveBeenCalledTimes(1);
    });

    test('should call the instance "$html.height" prop with the "lengthPct" value concatenated with "%" as an arg', () => {
      const line = instantiateLine($body).entity;
      const htmlHeightSpy = jest.spyOn(line.$html, 'height');

      line.lengthPct = 9.01;
      applyMod(line, lineVertical);

      expect(htmlHeightSpy).toHaveBeenCalledWith(`${line.lengthPct}%`);
      expect(htmlHeightSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('when is being removed', () => {
    test('should call the instance "$html.css" prop with ("height", "") args', () => {
      const line = instantiateLine($body).entity;
      const htmlCssSpy = jest.spyOn(line.$html, 'css');

      applyMod(line, lineVertical);
      htmlCssSpy.mockClear();
      removeMod(line, lineVertical);

      expect(htmlCssSpy).toHaveBeenCalledWith('height', '');
      expect(htmlCssSpy).toHaveBeenCalledTimes(1);
    });

    test('should call the instance "$html.width" prop with the "lengthPct" value concatenated with "%" as an arg', () => {
      const line = instantiateLine($body).entity;
      const htmlWidthSpy = jest.spyOn(line.$html, 'width');

      applyMod(line, lineVertical);
      line.lengthPct = 9.01;
      htmlWidthSpy.mockClear();
      removeMod(line, lineVertical);

      expect(htmlWidthSpy).toHaveBeenCalledWith(`${line.lengthPct}%`);
      expect(htmlWidthSpy).toHaveBeenCalledTimes(1);
    });
  });
});
