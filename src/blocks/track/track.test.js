const $ = require('jquery');
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

  describe('should instantiate descendant entities via the bem "createEntity" method', () => {
    describe('of type Line', () => {
      describe('#1', () => {
        test('should be accessible using the instance "path.line" field', () => {
          testTrack.doesSpawnEntity({
            Entity: Line,
            accessor: 'path.line'
          });
        });

        test('should be an immediate child of the Track entity', () => {
          testTrack.doesSpawnEntity({
            Entity: Line,
            accessor: 'path.line',
            parentAccessor: ''
          });
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

        describe('should have a mix created via the bem "addMix" method', () => {
          describe('of type TrackPath', () => {
            test('accessible using the instance "path.trackPath" field', () => {
              testTrack.doesMixEntities({
                Mix: TrackPath,
                baseAccessor: 'path.line',
                mixAccessor: 'path.trackPath'
              });
            });
          });
        });
      });

      describe('#2', () => {
        test('should be accessible using the instance "fill.line" field', () => {
          testTrack.doesSpawnEntity({
            Entity: Line,
            accessor: 'fill.line',
          });
        });

        test('should be a child of the entity which is a value of the "path.line" field', () => {
          testTrack.doesSpawnEntity({
            Entity: Line,
            accessor: 'fill.line',
            parentAccessor: 'path.line'
          });
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

        describe('should have a mix created via the bem "addMix" method', () => {
          describe('of type TrackFiller', () => {
            test('accessible using the instance "fill.trackFiller" field', () => {
              testTrack.doesMixEntities({
                Mix: TrackFiller,
                baseAccessor: 'fill.line',
                mixAccessor: 'fill.trackFiller'
              });
            });
          });
        });
      });
    });
  });

  describe('should expose "getPointPortion" method which calculates a result depending on applied modifiers', () => {
    const genHtml = ({ top, left }) => ({
      offset() {
        return {
          left,
          top
        };
      }
    });

    const mockTrack = ({
      lengthPx,
      thicknessPx,
      pathHtmlOffset,
      hasMod
    }) => {
      const track = instantiateTrack($body).entity;

      track.path.line = {
        lengthPx,
        thicknessPx,
        $html: genHtml(pathHtmlOffset)
      };
      track.hasMod = hasMod;

      return track;
    };

    const getExpectation = ({
      track,
      pageX,
      pageY
    }) => {
      const { lengthPx, thicknessPx, $html } = track.path.line;

      return {
        h: (pageX - ($html.offset().left + thicknessPx / 2))
          / (lengthPx - thicknessPx),

        v: (pageY - ($html.offset().top + thicknessPx / 2))
          / (lengthPx - thicknessPx)
      };
    };

    test('track_vertical modifier is not applied', () => {
      const trackData = {
        lengthPx: 100,
        thicknessPx: 10,
        pathHtmlOffset: { left: 20 },
        hasMod: () => false
      };
      const track = mockTrack(trackData);

      let pageX;
      let expectation;

      pageX = 80;
      expectation = getExpectation({ track, pageX }).h;

      expect(
        track.getPointPortion({ pageX })
      ).toBe(expectation);

      pageX = 200;
      expectation = getExpectation({ track, pageX }).h;

      expect(
        track.getPointPortion({ pageX })
      ).toBe(expectation);

      pageX = 0;
      expectation = getExpectation({ track, pageX }).h;

      expect(
        track.getPointPortion({ pageX })
      ).toBe(expectation);
    });

    test('track_vertical modifier is applied', () => {
      const trackData = {
        lengthPx: 200,
        thicknessPx: 50,
        pathHtmlOffset: { top: 40 },
        hasMod: () => true
      };
      const track = mockTrack(trackData);

      let pageY;
      let expectation;

      pageY = 80;
      expectation = getExpectation({ track, pageY }).v;

      expect(
        track.getPointPortion({ pageY })
      ).toBe(expectation);

      pageY = 200;
      expectation = getExpectation({ track, pageY }).v;

      expect(
        track.getPointPortion({ pageY })
      ).toBe(expectation);

      pageY = 0;
      expectation = getExpectation({ track, pageY }).v;

      expect(
        track.getPointPortion({ pageY })
      ).toBe(expectation);
    });
  });

  test('should expose "distancePx" getter which returns the distance the filler can float in', () => {
    const mockTrack = ({
      lengthPx,
      thicknessPx
    }) => {
      const track = instantiateTrack($body).entity;

      track.path = {
        line: {
          lengthPx,
          thicknessPx
        }
      };

      return track;
    };

    const getExpectation = ({ lengthPx, thicknessPx }) => (
      lengthPx - thicknessPx
    );

    let track;
    let lengthPx;
    let thicknessPx;

    lengthPx = 20;
    thicknessPx = 10;
    track = mockTrack({
      lengthPx,
      thicknessPx
    });

    expect(track.distancePx).toBe(getExpectation({
      lengthPx,
      thicknessPx
    }));

    lengthPx = 500;
    thicknessPx = 2;
    track = mockTrack({
      lengthPx,
      thicknessPx
    });

    expect(track.distancePx).toBe(getExpectation({
      lengthPx,
      thicknessPx
    }));
  });

  describe('should expose "fillStartPortion" getter/setter', () => {
    describe('getter', () => {
      test('should return null by default', () => {
        const track = instantiateTrack($body).entity;

        expect(track.fillStartPortion).toBe(null);
      });

      test('should return what was previously set by the setter', () => {
        const track = instantiateTrack($body).entity;

        track.fillStartPortion = 0.1;
        expect(track.fillStartPortion).toBe(0.1);

        track.fillStartPortion = null;
        expect(track.fillStartPortion).toBe(null);

        track.fillStartPortion = 0.2;
        expect(track.fillStartPortion).toBe(0.2);
      });
    });

    describe('setter', () => {
      describe('should set the instance "fill.trackFiller.marginPx" field value', () => {
        test('to 0 when the argument is null', () => {
          const track = instantiateTrack($body).entity;
          const trackFillerMarginPxSpy = jest
            .spyOn(track.fill.trackFiller, 'marginPx', 'set');

          track.fillStartPortion = null;

          expect(trackFillerMarginPxSpy)
            .toHaveBeenLastCalledWith(0);
        });

        test('to the calculated number when the argument is a number from range [0, 1]', () => {
          const track = instantiateTrack($body).entity;
          const trackFillerMarginPxSpy = jest
            .spyOn(track.fill.trackFiller, 'marginPx', 'set');

          const getExpectation = (fraction) => {
            const { lengthPx, thicknessPx } = track.path.line;

            return thicknessPx / 2 + (lengthPx - thicknessPx) * fraction;
          };

          track.path.line = {
            lengthPx: 100,
            thicknessPx: 10
          };
          track.fillStartPortion = 0.5;

          expect(trackFillerMarginPxSpy)
            .toHaveBeenLastCalledWith(getExpectation(0.5));

          track.path.line = {
            lengthPx: 500,
            thicknessPx: 100
          };
          track.fillStartPortion = 0.2;

          expect(trackFillerMarginPxSpy)
            .toHaveBeenLastCalledWith(getExpectation(0.2));
        });
      });

      test('should set the instance "fillEndPortion" field value to its previously set value (default if none was set)', () => {
        const track = instantiateTrack($body).entity;
        const trackFillEndPortionSpy = jest
          .spyOn(track, 'fillEndPortion', 'set');
        const def = track.fillEndPortion;

        track.fillStartPortion = 0;

        expect(trackFillEndPortionSpy)
          .toHaveBeenLastCalledWith(def);

        track.fillEndPortion = 0.5;
        track.fillStartPortion = 0.2;

        expect(trackFillEndPortionSpy)
          .toHaveBeenLastCalledWith(0.5);

        track.fillEndPortion = 0.6;
        track.fillStartPortion = null;

        expect(trackFillEndPortionSpy)
          .toHaveBeenLastCalledWith(0.6);
      });
    });
  });

  describe('should expose "fillEndPortion" getter/setter', () => {
    describe('getter', () => {
      test('should return 0 by default', () => {
        const track = instantiateTrack($body).entity;

        expect(track.fillEndPortion).toBe(0);
      });

      test('should return what was previously set by the setter', () => {
        const track = instantiateTrack($body).entity;

        track.fillEndPortion = 0.1;
        expect(track.fillEndPortion).toBe(0.1);

        track.fillEndPortion = null;
        expect(track.fillEndPortion).toBe(null);

        track.fillEndPortion = 0.2;
        expect(track.fillEndPortion).toBe(0.2);
      });
    });

    describe('setter', () => {
      describe('should set the instance "fill.line.lengthPct" field value depending on the "fillStartPortion" field value', () => {
        test('"fillStartPortion" field value is null', () => {
          const track = instantiateTrack($body).entity;
          const lineLengthPctSpy = jest
            .spyOn(track.fill.line, 'lengthPct', 'set');

          jest.spyOn(track, 'fillStartPortion', 'get')
            .mockImplementation(() => null);

          const getExpectation = (fraction) => {
            const {
              lengthPx,
              thicknessPx
            } = track.path.line;

            return (fraction * (lengthPx - thicknessPx)
              + thicknessPx / 2) / lengthPx * 100;
          };

          track.path.line = {
            lengthPx: 100,
            thicknessPx: 10
          };
          track.fillEndPortion = 0.5;

          expect(lineLengthPctSpy)
            .toHaveBeenLastCalledWith(getExpectation(0.5));

          track.path.line = {
            lengthPx: 200,
            thicknessPx: 50
          };
          track.fillEndPortion = 0.9;

          expect(lineLengthPctSpy)
            .toHaveBeenLastCalledWith(getExpectation(0.9));

          track.path.line = {
            lengthPx: 100,
            thicknessPx: 2
          };
          track.fillEndPortion = 0;

          expect(lineLengthPctSpy)
            .toHaveBeenLastCalledWith(getExpectation(0));
        });

        test('"fillStartPortion" field value is in range [0, 1]', () => {
          const track = instantiateTrack($body).entity;
          const lineLengthPctSpy = jest
            .spyOn(track.fill.line, 'lengthPct', 'set');
          const trackFillStartPortionSpy = jest
            .spyOn(track, 'fillStartPortion', 'get');

          const getExpectation = (fraction) => {
            const {
              fillStartPortion,
              path
            } = track;
            const {
              lengthPx,
              thicknessPx
            } = path.line;

            return (fraction - fillStartPortion)
              * (lengthPx - thicknessPx) / lengthPx * 100;
          };

          track.path.line = {
            lengthPx: 100,
            thicknessPx: 10
          };
          trackFillStartPortionSpy.mockImplementation(() => 0.1);
          track.fillEndPortion = 0.5;

          expect(lineLengthPctSpy)
            .toHaveBeenLastCalledWith(getExpectation(0.5));

          track.path.line = {
            lengthPx: 98,
            thicknessPx: 8
          };
          trackFillStartPortionSpy.mockImplementation(() => 0);
          track.fillEndPortion = 1;

          expect(lineLengthPctSpy)
            .toHaveBeenLastCalledWith(getExpectation(1));

          track.path.line = {
            lengthPx: 900,
            thicknessPx: 25
          };
          trackFillStartPortionSpy.mockImplementation(() => 0.5);
          track.fillEndPortion = 0.6;

          expect(lineLengthPctSpy)
            .toHaveBeenLastCalledWith(getExpectation(0.6));
        });
      });
    });
  });
});
