const $ = require('jquery');
const Circle = require('../circle').default;
const circleHintHidden = require('./circle_hint-hidden').default;
const {
  instantiateEntity: instantiateCircle,
  removeEntities: removeCircles,
  applyMod,
  removeMod
} = require('../../../../test/bem/entity')({
  Entity: Circle
});

const $body = $('body');

describe('circle_hint-hidden modifier', () => {
  beforeEach(() => {
    removeCircles();
  });

  describe('when is being applied', () => {
    test('should apply circle__hint_hidden modifier on the instance "hint.circleHint" field value', () => {
      const circle = instantiateCircle($body).entity;
      const circleHintApplyModSpy = jest.spyOn(
        circle.hint.circleHint, 'applyMod'
      );

      applyMod(circle, circleHintHidden);

      expect(circleHintApplyModSpy.mock.calls[0][0])
        .toBe('circle__hint_hidden');
    });
  });

  describe('when is being removed', () => {
    test('should remove circle__hint_hidden modifier from the instance "hint.circleHint" field value', () => {
      const circle = instantiateCircle($body).entity;
      const circleHintRemoveModSpy = jest.spyOn(
        circle.hint.circleHint, 'removeMod'
      );

      removeMod(circle, circleHintHidden);

      expect(circleHintRemoveModSpy.mock.calls[0][0])
        .toBe('circle__hint_hidden');
    });
  });
});
