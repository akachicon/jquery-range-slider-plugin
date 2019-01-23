const CircleHint = require('./circle__hint').default;
const {
  testEntity: testCircleHint
} = require('../../../../test/bem/entity')({
  Entity: CircleHint,
  mix: true
});

describe('Circle class', () => {
  test.skip('should extend Modifiable', () => {
    testCircleHint.doesExtendModifiable();
  });

  test('should assign "circle__hint" class to a passed jquery element"', () => {
    
  });
});
