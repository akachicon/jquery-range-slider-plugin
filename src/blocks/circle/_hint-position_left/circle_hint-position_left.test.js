const $ = require('jquery');
const Circle = require('../circle').default;
const circleHintPositionLeft = require('./circle_hint-position_left').default;
const {
  instantiateEntity: instantiateCircle,
  removeEntities: removeCircles,
  applyMod,
  removeMod
} = require('../../../../test/bem/entity')({
  Entity: Circle
});

const $body = $('body');

describe('circle_hint-position_left modifier', () => {
  beforeEach(() => {
    removeCircles();
  });

  describe('when is being applied', () => {
    test('should apply hint_left modifier on the instance "hint.hint" field value', () => {
      const circle = instantiateCircle($body).entity;
      const hintApplyModSpy = jest.spyOn(
        circle.hint.hint, 'applyMod'
      );

      applyMod(circle, circleHintPositionLeft);

      expect(hintApplyModSpy.mock.calls[0][0])
        .toBe('hint_left');
    });

    test('should apply circle__hint_left modifier on the instance "hint.circleHint" field value', () => {
      const circle = instantiateCircle($body).entity;
      const circleHintApplyModSpy = jest.spyOn(
        circle.hint.circleHint, 'applyMod'
      );

      applyMod(circle, circleHintPositionLeft);

      expect(circleHintApplyModSpy.mock.calls[0][0])
        .toBe('circle__hint_left');
    });
  });

  describe('when is being removed', () => {
    test('should remove hint_left modifier from the instance "hint.hint" field value', () => {
      const circle = instantiateCircle($body).entity;
      const hintRemoveModSpy = jest.spyOn(
        circle.hint.hint, 'removeMod'
      );

      removeMod(circle, circleHintPositionLeft);

      expect(hintRemoveModSpy.mock.calls[0][0])
        .toBe('hint_left');
    });

    test('should remove circle__hint_left modifier from the instance "hint.circleHint" field value', () => {
      const circle = instantiateCircle($body).entity;
      const circleHintRemoveModSpy = jest.spyOn(
        circle.hint.circleHint, 'removeMod'
      );

      removeMod(circle, circleHintPositionLeft);

      expect(circleHintRemoveModSpy.mock.calls[0][0])
        .toBe('circle__hint_left');
    });
  });
});
