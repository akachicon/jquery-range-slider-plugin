const $ = require('jquery');
const Track = require('../track').default;
const trackEmpty = require('./track_empty').default;
const {
  testEntity: testTrack
} = require('../../../../test/bem/entity')({
  Entity: Track
});

describe('track_empty modifier', () => {
  describe('when is being applied', () => {
    test('should call track__filler_hidden modifier on the instance "fill.trackFiller" field value', () => {
      testTrack.doesApply(
        trackEmpty,
        'track__filler_hidden',
        'fill.trackFiller'
      );
    });
  });

  describe('when is being removed', () => {
    test('should remove track__filler_hidden modifier from the instance "fill.trackFiller" field value', () => {
      testTrack.doesRemove(
        trackEmpty,
        'track__filler_hidden',
        'fill.trackFiller'
      );
    });
  });
});
