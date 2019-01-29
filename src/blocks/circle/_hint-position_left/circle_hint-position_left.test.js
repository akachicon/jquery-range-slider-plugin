const Circle = require('../circle').default;
const circleHintPositionLeft = require('./circle_hint-position_left').default;
const {
  testEntity: testCircle
} = require('../../../../test/bem/entity')({
  Entity: Circle
});

describe('circle_hint-position_left modifier', () => {
  describe('when is being applied', () => {
    test('should apply hint_left modifier to the instance "hint.hint" field value', () => {
      testCircle.doesApply(
        circleHintPositionLeft,
        'hint_left',
        'hint.hint'
      );
    });

    test('should apply circle__hint_left modifier to the instance "hint.circleHint" field value', () => {
      testCircle.doesApply(
        circleHintPositionLeft,
        'circle__hint_left',
        'hint.circleHint'
      );
    });
  });

  describe('when is being removed', () => {
    test('should remove hint_left modifier from the instance "hint.hint" field value', () => {
      testCircle.doesRemove(
        circleHintPositionLeft,
        'hint_left',
        'hint.hint'
      );
    });

    test('should remove circle__hint_left modifier from the instance "hint.circleHint" field value', () => {
      testCircle.doesRemove(
        circleHintPositionLeft,
        'circle__hint_left',
        'hint.circleHint'
      );
    });
  });
});
