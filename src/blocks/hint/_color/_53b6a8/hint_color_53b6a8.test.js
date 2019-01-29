const Hint = require('../../hint').default;
const hintColor = require('./hint_color_53b6a8').default;
const {
  testEntity: testHint
} = require('../../../../../test/bem/entity')({
  Entity: Hint
});

describe('hint_color_53b6a8 modifier', () => {
  describe('when is being applied', () => {
    test('should apply hint__content_color_53b6a8 modifier to the instance "content" field value', () => {
      testHint.doesApply(
        hintColor,
        'hint__content_color_53b6a8',
        'content'
      );
    });
  });

  describe('when is being removed', () => {
    test('should remove hint__content_color_53b6a8 modifier from the instance "content" field value', () => {
      testHint.doesRemove(
        hintColor,
        'hint__content_color_53b6a8',
        'content'
      );
    });
  });
});
