const Circle = require('../circle').default;
const circleHintHidden = require('./circle_hint-hidden').default;
const {
  testEntity: testCircle
} = require('../../../../test/bem/entity')({
  Entity: Circle
});

describe('circle_hint-position_left modifier', () => {
  describe('when is being applied', () => {
    test('should apply circle__hint_hidden modifier to the instance "hint.circleHint" field value', () => {
      testCircle.doesApply(
        circleHintHidden,
        'circle__hint_hidden',
        'hint.circleHint'
      );
    });
  });

  describe('when is being removed', () => {
    test('should remove circle__hint_hidden modifier from the instance "hint.circleHint" field value', () => {
      testCircle.doesRemove(
        circleHintHidden,
        'circle__hint_hidden',
        'hint.circleHint'
      );
    });
  });
});
