const $ = require('jquery');
const TrackFiller = require('./track__filler').default;
const {
  instantiateMixEntity: instantiateTrackFiller,
  testEntity: testTrackFiller
} = require('../../../../test/bem/entity')({
  Entity: TrackFiller,
  expected: {
    className: 'track__filler'
  }
});

describe('TrackFiller class', () => {
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
          const $html = $('<div></div>');
          const trackFiller = instantiateTrackFiller({ $html }).entity;
          const htmlCssSpy = jest.spyOn($html, 'css');

          trackFiller.marginPx = 10;
          expect(htmlCssSpy).toHaveBeenLastCalledWith('margin-left', '10px');

          trackFiller.marginPx = 0;
          expect(htmlCssSpy).toHaveBeenLastCalledWith('margin-left', '0px');
        });
      });

      describe('track__filler_vertical modifier is applied', () => {
        test('should call the instance "$html.css" with ("margin-top", setterArg + "px")', () => {
          const $html = $('<div></div>');
          const trackFiller = instantiateTrackFiller({ $html }).entity;
          const htmlCssSpy = jest.spyOn($html, 'css');

          jest.spyOn(trackFiller, 'hasMod')
            .mockImplementation(() => true);

          trackFiller.marginPx = 10;
          expect(htmlCssSpy).toHaveBeenLastCalledWith('margin-top', '10px');

          trackFiller.marginPx = -5;
          expect(htmlCssSpy).toHaveBeenLastCalledWith('margin-top', '-5px');
        });
      });
    });
  });

  describe('getter', () => {
    test('shuold return previously set value (default if none was set)', () => {
      const def = 0;
      const trackFiller = instantiateTrackFiller({
        $html: $('<div></div>')
      }).entity;

      expect(trackFiller.marginPx).toBe(def);

      trackFiller.marginPx = 10;
      expect(trackFiller.marginPx).toBe(10);

      trackFiller.marginPx = -5;
      expect(trackFiller.marginPx).toBe(-5);
    });
  });
});
