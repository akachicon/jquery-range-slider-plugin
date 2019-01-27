const $ = require('jquery');
const Track = require('../track').default;
const trackVertical = require('./track_vertical').default;
const {
  instantiateEntity: instantiateTrack,
  removeEntities: removeTracks,
  applyMod,
  removeMod,
  testEntity: testTrack
} = require('../../../../test/bem/entity')({
  Entity: Track
});

const $body = $('body');

describe('track_vertical modifier', () => {
  beforeEach(() => {
    removeTracks();
  });

  describe('when is being applied', () => {
    test('should call line_vertical modifier on the instance "path.line" field value', () => {
      testTrack.doesApply(
        trackVertical,
        'line_vertical',
        'path.line'
      );
    });

    test('should call line_vertical modifier on the instance "fill.line" field value', () => {
      testTrack.doesApply(
        trackVertical,
        'line_vertical',
        'fill.line'
      );
    });

    test('should call track__filler_vertical modifier on the instance "fill.trackFiller" field value', () => {
      testTrack.doesApply(
        trackVertical,
        'track__filler_vertical',
        'fill.trackFiller'
      );
    });

    test('should set the instance "fillStartPortion" field value to its previously set value (default if none was set)', () => {
      const track = instantiateTrack($body).entity;
      const trackFillStartPortionSpy = jest
        .spyOn(track, 'fillStartPortion', 'set');
      const def = track.fillStartPortion;

      applyMod(track, trackVertical);

      expect(trackFillStartPortionSpy)
        .toHaveBeenLastCalledWith(def);

      track.fillStartPortion = 0.5;
      applyMod(track, trackVertical);

      expect(trackFillStartPortionSpy)
        .toHaveBeenLastCalledWith(0.5);

      track.fillStartPortion = null;
      applyMod(track, trackVertical);

      expect(trackFillStartPortionSpy)
        .toHaveBeenLastCalledWith(null);
    });
  });

  describe('when is being removed', () => {
    test('should remove line_vertical modifier from the instance "path.line" field value', () => {
      testTrack.doesRemove(
        trackVertical,
        'line_vertical',
        'path.line'
      );
    });

    test('should remove line_vertical modifier from the instance "fill.line" field value', () => {
      testTrack.doesRemove(
        trackVertical,
        'line_vertical',
        'fill.line'
      );
    });

    test('should remove track__filler_vertical modifier from the instance "fill.trackFiller" field value', () => {
      testTrack.doesRemove(
        trackVertical,
        'track__filler_vertical',
        'fill.trackFiller'
      );
    });

    test('should set the instance "fillStartPortion" field value to its previously set value (default if none was set)', () => {
      const track = instantiateTrack($body).entity;
      const trackFillStartPortionSpy = jest
        .spyOn(track, 'fillStartPortion', 'set');
      const def = track.fillStartPortion;

      removeMod(track, trackVertical);

      expect(trackFillStartPortionSpy)
        .toHaveBeenLastCalledWith(def);

      track.fillStartPortion = 1;
      removeMod(track, trackVertical);

      expect(trackFillStartPortionSpy)
        .toHaveBeenLastCalledWith(1);

      track.fillStartPortion = null;
      removeMod(track, trackVertical);

      expect(trackFillStartPortionSpy)
        .toHaveBeenLastCalledWith(null);
    });
  });
});
