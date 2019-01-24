const CircleHint = require('./circle__hint').default;
const {
  testEntity: testCircleHint
} = require('../../../../test/bem/entity')({
  Entity: CircleHint,
  expected: {
    className: 'circle__hint'
  }
});

describe('CircleHint class', () => {
  test('should extend Modifiable', () => {
    testCircleHint.doesMixExtendModifiable();
  });

  test('should assign "circle__hint" class to a passed jquery element"', () => {
    testCircleHint.doesMixConformToClassName();
  });
});
