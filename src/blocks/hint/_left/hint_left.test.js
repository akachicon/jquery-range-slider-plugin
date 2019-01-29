const Hint = require('../hint').default;
const hintLeft = require('./hint_left').default;
const {
  testEntity: testHint
} = require('../../../../test/bem/entity')({
  Entity: Hint
});

describe('hint_left modifier', () => {
  describe('when is being applied', () => {
    test('should apply hint__content_left modifier to the instance "content" field value', () => {
      testHint.doesApply(
        hintLeft,
        'hint__content_left',
        'content'
      );
    });
  });

  describe('when is being removed', () => {
    test('should remove hint__content_left modifier from the instance "content" field value', () => {
      testHint.doesRemove(
        hintLeft,
        'hint__content_left',
        'content'
      );
    });
  });
});
