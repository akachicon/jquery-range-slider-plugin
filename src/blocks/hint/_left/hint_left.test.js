const $ = require('jquery');
const Hint = require('../hint').default;
const hintLeft = require('./hint_left').default;
const {
  instantiateEntity: instantiateHint,
  removeEntities: removeHints,
  applyMod,
  removeMod
} = require('../../../../test/bem/entity')({
  Entity: Hint
});

const $body = $('body');

describe('hint_left modifier', () => {
  beforeEach(() => {
    removeHints();
  });

  describe('when is being applied', () => {
    test('should apply hint__content_left modifier on the instance "content" field value', () => {
      const hint = instantiateHint($body).entity;
      const contentApplyModSpy = jest.spyOn(hint.content, 'applyMod');

      applyMod(hint, hintLeft);

      expect(contentApplyModSpy.mock.calls[0][0])
        .toBe('hint__content_left');
    });
  });

  describe('when is being removed', () => {
    test('should remove hint__content_left modifier from the instance "content" field value', () => {
      const hint = instantiateHint($body).entity;
      const contentRemoveModSpy = jest.spyOn(hint.content, 'removeMod');

      removeMod(hint, hintLeft);

      expect(contentRemoveModSpy.mock.calls[0][0])
        .toBe('hint__content_left');
    });
  });
});
