const TrackPath = require('./track__path').default;
const {
  testEntity: testTrackPath
} = require('../../../../test/bem/entity')({
  Entity: TrackPath,
  expected: {
    className: 'track__path'
  }
});

describe('TrackPath class', () => {
  test('should extend Modifiable', () => {
    testTrackPath.doesMixExtendModifiable();
  });

  test('should assign "track__path" class to a passed jquery element"', () => {
    testTrackPath.doesMixConformToClassName();
  });
});
