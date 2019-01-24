const $ = require('jquery');
const { Modifiable } = require('../../bem');
const Track = require('./track').default;
const TrackPath = require('./__path/track__path').default;
const TrackFiller = require('./__filler/track__filler').default;
const Line = require('../line/line').default;
const {
  instantiateEntity: instantiateTrack,
  removeEntities: removeTracks,
  testEntity: testTrack
} = require('../../../test/bem/entity')({
  Entity: Track,
  expected: {
    tagName: 'DIV',
    className: 'track'
  }
});

const $body = $('body');

describe('Track class', () => {
  beforeEach(() => {
    removeTracks();
  });

  test('should extend Modifiable', () => {
    testTrack.doesExtendModifiable();
  });

  describe('should call a passed first arg function in the constructor', () => {
    test('with a jquery div element', () => {
      testTrack.doesConformToTagName();
    });

    test('with a jquery element that has class "track"', () => {
      testTrack.doesConformToClassName();
    });
  });

  describe('should instantiate descendant entities via createEntity', () => {
    describe('of type Line', () => {
      describe('#1', () => {
        test('should be accessible using the instance "path.line" field', () => {
          const {
            entity: track,
            createEntityCalls
          } = instantiateTrack($body);

          expect(createEntityCalls.map(call => call.result))
            .toContain(track.path.line);

          const [testedCall] = createEntityCalls
            .filter(call => call.result === track.path.line);

          expect(testedCall.args[0].Entity).toBe(Line);
        });

        test('should be an immediate child of the Track entity', () => {
          const {
            entity: track,
            createEntityCalls
          } = instantiateTrack($body);

          expect(createEntityCalls.map(call => call.result))
            .toContain(track.path.line);

          const [testedCall] = createEntityCalls
            .filter(call => call.result === track.path.line);

          expect(testedCall.args[0].$parent).toBe(track.$html);
        });

        describe('should have applied modifiers', () => {
          test('line_rounded', () => {
            const { entity: track } = instantiateTrack($body);

            testTrack.hasModBeenApplied({
              mod: 'line_rounded',
              to: track.path.line
            });
          });

          test('line_color_e5e5e5', () => {
            const { entity: track } = instantiateTrack($body);

            testTrack.hasModBeenApplied({
              mod: 'line_color_e5e5e5',
              to: track.path.line
            });
          });
        });

        describe('should have a mix created via addMix', () => {
          describe('of type TrackPath', () => {
            test('accessible using the instance "path.trackPath" field', () => {
              const {
                entity: track,
                addMixCalls
              } = instantiateTrack($body);

              expect(addMixCalls.map(call => call.result))
                .toContain(track.path.trackPath);

              const [testedCall] = addMixCalls
                .filter(call => call.result === track.path.trackPath);

              expect(testedCall.args[0].Mix).toBe(TrackPath);
              expect(testedCall.args[0].entity).toBe(track.path.line);
            });
          });
        });
      });

      describe('#2', () => {
        test('should be accessible using the instance "fill.line" field', () => {
          const {
            entity: track,
            createEntityCalls
          } = instantiateTrack($body);

          expect(createEntityCalls.map(call => call.result))
            .toContain(track.fill.line);

          const [testedCall] = createEntityCalls
            .filter(call => call.result === track.fill.line);

          expect(testedCall.args[0].Entity).toBe(Line);
        });

        test('should be a child of the entity "path.line" entity', () => {
          const {
            entity: track,
            createEntityCalls
          } = instantiateTrack($body);

          expect(createEntityCalls.map(call => call.result))
            .toContain(track.fill.line);

          const [testedCall] = createEntityCalls
            .filter(call => call.result === track.fill.line);

          expect(testedCall.args[0].$parent).toBe(track.path.line.$html);
        });

        describe('should have applied modifiers', () => {
          test('line_color_53b6a8', () => {
            const { entity: track } = instantiateTrack($body);

            testTrack.hasModBeenApplied({
              mod: 'line_color_53b6a8',
              to: track.fill.line
            });
          });
        });

        describe('should have a mix created via addMix', () => {
          describe('of type TrackFiller', () => {
            test('accessible using the instance "fill.trackFiller" field', () => {
              const {
                entity: track,
                addMixCalls
              } = instantiateTrack($body);

              expect(addMixCalls.map(call => call.result))
                .toContain(track.fill.trackFiller);

              const [testedCall] = addMixCalls
                .filter(call => call.result === track.fill.trackFiller);

              expect(testedCall.args[0].Mix).toBe(TrackFiller);
              expect(testedCall.args[0].entity).toBe(track.fill.line);
            });
          });
        });
      });
    });
  });
});
