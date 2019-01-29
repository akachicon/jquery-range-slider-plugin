const $ = require('jquery');
const Track = require('../../track').default;
const TrackFiller = require('../track__filler').default;
const trackFillerVertical = require('./track__filler_vertical').default;
const testBemEntity = require('../../../../../test/bem/entity');

const {
  instantiateEntity: instantiateTrack,
  removeEntities: removeTracks
} = testBemEntity({ Entity: Track });
const {
  instantiateMixEntity: instantiateTrackFiller,
  applyMod,
  removeMod
} = testBemEntity({ Entity: TrackFiller });

const $body = $('body');

describe('track__filler_vertical modifier', () => {
  beforeEach(() => {
    removeTracks();
  });

  describe('when is being applied', () => {
    test('should call the instance "$html.css" function with ("margin-left", 0)', () => {
      const track = instantiateTrack($body).entity;
      const trackFiller = instantiateTrackFiller(track).entity;
      const htmlCssSpy = jest.spyOn(trackFiller.$html, 'css');

      applyMod(trackFiller, trackFillerVertical);

      expect(htmlCssSpy).toHaveBeenCalledWith('margin-left', 0);
    });
  });

  describe('when is being removed', () => {
    test('should remove track__filler_hidden modifier from the instance "fill.trackFiller" field value', () => {
      const track = instantiateTrack($body).entity;
      const trackFiller = instantiateTrackFiller(track).entity;
      const htmlCssSpy = jest.spyOn(trackFiller.$html, 'css');

      removeMod(trackFiller, trackFillerVertical);

      expect(htmlCssSpy).toHaveBeenCalledWith('margin-top', 0);
    });
  });
});
