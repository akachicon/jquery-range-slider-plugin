const $ = require('jquery');
const Track = require('../track').default;
const TrackFiller = require('./track__filler').default;
const testBemEntity = require('../../../../test/bem/entity');

const {
  instantiateEntity: instantiateTrack,
  removeEntities: removeTracks
} = testBemEntity({ Entity: Track });
const {
  instantiateMixEntity: instantiateTrackFiller,
  testEntity: testTrackFiller
} = testBemEntity({
  Entity: TrackFiller,
  expected: {
    className: 'track__filler'
  }
});

const $body = $('body');

describe('TrackFiller class', () => {
  beforeEach(() => {
    removeTracks();
  });

  test('should extend Modifiable', () => {
    testTrackFiller.doesMixExtendModifiable();
  });

  test('should assign "track__filler" class to a passed jquery element"', () => {
    testTrackFiller.doesMixConformToClassName();
  });

  describe('should expose "marginPx" getter/setter', () => {
    describe('setter', () => {
      describe('track__filler_vertical modifier is not applied', () => {
        test('should call the instance "$html.css" with ("margin-left", setterArg + "px")', () => {
          const track = instantiateTrack($body).entity;
          const trackFiller = instantiateTrackFiller(track).entity;
          const htmlCssSpy = jest.spyOn(track.$html, 'css');

          trackFiller.marginPx = 10;
          expect(htmlCssSpy).toHaveBeenCalledWith('margin-left', '10px');

          trackFiller.marginPx = 0;
          expect(htmlCssSpy).toHaveBeenCalledWith('margin-left', '0px');
        });
      });

      describe('track__filler_vertical modifier is applied', () => {
        test('should call the instance "$html.css" with ("margin-top", setterArg + "px")', () => {
          const track = instantiateTrack($body).entity;
          const trackFiller = instantiateTrackFiller(track).entity;
          const htmlCssSpy = jest.spyOn(track.$html, 'css');

          jest.spyOn(trackFiller, 'hasMod')
            .mockImplementation(() => true);

          trackFiller.marginPx = 10;
          expect(htmlCssSpy).toHaveBeenCalledWith('margin-top', '10px');

          trackFiller.marginPx = -5;
          expect(htmlCssSpy).toHaveBeenCalledWith('margin-top', '-5px');
        });
      });
    });
  });

  describe('getter', () => {
    test('should return previously set value (default if none was set)', () => {
      const def = 0;
      const track = instantiateTrack($body).entity;
      const trackFiller = instantiateTrackFiller(track).entity;

      expect(trackFiller.marginPx).toBe(def);

      trackFiller.marginPx = 10;
      expect(trackFiller.marginPx).toBe(10);

      trackFiller.marginPx = -5;
      expect(trackFiller.marginPx).toBe(-5);
    });
  });
});
