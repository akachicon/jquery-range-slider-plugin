const $ = require('jquery');
const Hint = require('../../hint').default;
const hintLeft = require('./hint_color_53b6a8').default;
const {
  instantiateEntity: instantiateHint,
  removeEntities: removeHints,
  applyMod,
  removeMod
} = require('../../../../../test/bem/entity')({
  Entity: Hint
});

const $body = $('body');

describe('hint_color_53b6a8 modifier', () => {
  beforeEach(() => {
    removeHints();
  });

  describe('when is being applied', () => {
    test('should apply hint__content_color_53b6a8 modifier on the instance "content" field value', () => {
      const hint = instantiateHint($body);
      const hintContentApplyModSpy = jest.spyOn(hint.content, 'applyMod');

      applyMod(hint, hintLeft);

      expect(hintContentApplyModSpy.mock.calls[0][0])
        .toBe('hint__content_color_53b6a8');
    });
  });

  describe('when is being removed', () => {
    test('should remove hint__content_color_53b6a8 modifier from the instance "content" field value', () => {
      const hint = instantiateHint($body);
      const hintContentRemoveModSpy = jest.spyOn(hint.content, 'removeMod');

      removeMod(hint, hintLeft);

      expect(hintContentRemoveModSpy.mock.calls[0][0])
        .toBe('hint__content_color_53b6a8');
    });
  });
});
