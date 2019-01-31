const $ = require('jquery');
const RangeSlider = require('./range-slider').default;
const RangeSliderThumb = require('./__thumb/range-slider__thumb').default;
const Track = require('../track/track').default;
const Circle = require('../circle/circle').default;

const {
  instantiateEntity: instantiateRangeSlider,
  removeEntities: removeRangeSliders,
  testEntity: testRangeSlider
} = require('../../../test/bem/entity')({
  Entity: RangeSlider,
  expected: {
    tagName: 'DIV',
    className: 'range-slider'
  }
});
const {
  instantiateEntity: instantiateTrack,
} = require('../../../test/bem/entity')({
  Entity: Track,
});
const {
  mockBemToTrackCalls,
  bemMockRestore
} = require('../../../test/bem');

const $body = $('body');

describe('RangeSlider class', () => {
  beforeEach(() => {
    removeRangeSliders();
  });

  test('should extend Modifiable', () => {
    testRangeSlider.doesExtendModifiable();
  });

  describe('should call a passed first arg function in the constructor', () => {
    test('with a jquery div element', () => {
      testRangeSlider.doesConformToTagName();
    });

    test('with a jquery element that has class "range-slider"', () => {
      testRangeSlider.doesConformToClassName();
    });
  });

  describe('should instantiate child Track entity via the bem "createEntity" method', () => {
    test('accessible using the instance "track" field', () => {
      testRangeSlider.doesSpawnEntity({
        Entity: Track,
        accessor: 'track',
        parentAccessor: ''
      });
    });
  });

  describe('should expose "thumbs" property which value is an object containing the fields', () => {
    const genThumbSpy = jest.spyOn(RangeSlider, 'genThumb');

    ['single', 'rangeFirst', 'rangeSecond'].forEach((testedField) => {
      describe(`"${testedField}"`, () => {
        test('should be a result of RangeSlider "genThumb" method call', () => {
          const rangeSlider = instantiateRangeSlider($body).entity;
          const generatedThumbs = genThumbSpy.mock.results
            .map(res => res.value);

          expect(generatedThumbs).toContain(rangeSlider.thumbs[testedField]);
        });

        describe('should be a result of RangeSlider "genThumb" method called with an object containing the fields', () => {
          const rangeSlider = instantiateRangeSlider($body).entity;
          const generatedThumbs = genThumbSpy.mock.results
            .map((res, idx) => ({ result: res.value, idx }));

          const genThumbArgIdx = generatedThumbs
            .filter(thumb => rangeSlider.thumbs[testedField] === thumb.result)[0]
            .idx;
          const [genThumbArg] = genThumbSpy.mock.calls[genThumbArgIdx];

          describe('"track"', () => {
            test('should be the instance "track" field value', () => {
              expect(genThumbArg.track).toBe(rangeSlider.track);
            });
          });

          describe('"$parent"', () => {
            test('should be the instance html', () => {
              expect(genThumbArg.$parent).toBe(rangeSlider.$html);
            });
          });

          describe('"portionCallback"', () => {
            describe('should be a function which behaviour depends on modifiers', () => {
              const { portionCallback } = genThumbArg;

              const doesNotAffectTrackFields = (hasModMock) => {
                test('does not access the instance "track.fillStartPortion" or "track.fillEndPortion" fields', () => {
                  const fillStartPortionSpy = jest.spyOn(
                    rangeSlider.track,
                    'fillStartPortion',
                    'set'
                  );
                  const fillEndPortionSpy = jest.spyOn(
                    rangeSlider.track,
                    'fillEndPortion',
                    'set'
                  );
                  const hasModSpy = jest.spyOn(rangeSlider, 'hasMod');

                  hasModSpy.mockImplementation(hasModMock);
                  portionCallback(0.441);

                  expect(fillStartPortionSpy).not.toHaveBeenCalled();
                  expect(fillEndPortionSpy).not.toHaveBeenCalled();

                  fillStartPortionSpy.mockRestore();
                  fillEndPortionSpy.mockRestore();
                  hasModSpy.mockRestore();
                });
              };

              // eslint-disable-next-line default-case
              switch (testedField) {
                case 'single':
                  describe('range-slider_range_multiple is not applied', () => {
                    test('assigns an argument to the instance "track.fillEndPortion" field', () => {
                      const fillEndPortionSpy = jest.spyOn(
                        rangeSlider.track,
                        'fillEndPortion',
                        'set'
                      );
                      const hasModSpy = jest.spyOn(rangeSlider, 'hasMod');

                      hasModSpy.mockImplementation(() => false);
                      portionCallback(0.441);

                      expect(fillEndPortionSpy).toHaveBeenCalledWith(0.441);

                      fillEndPortionSpy.mockRestore();
                      hasModSpy.mockRestore();
                    });
                  });

                  describe('range-slider_range_multiple is applied', () => {
                    doesNotAffectTrackFields(() => true);
                  });
                  break;

                case 'rangeFirst':
                  // eslint-disable-next-line jest/no-identical-title
                  describe('range-slider_range_multiple is not applied', () => {
                    doesNotAffectTrackFields(() => false);
                  });

                  // eslint-disable-next-line jest/no-identical-title
                  describe('range-slider_range_multiple is applied', () => {
                    test('assigns an argument to the instance "track.fillStartPortion" field', () => {
                      const fillStartPortionSpy = jest.spyOn(
                        rangeSlider.track,
                        'fillStartPortion',
                        'set'
                      );
                      const hasModSpy = jest.spyOn(rangeSlider, 'hasMod');

                      hasModSpy.mockImplementation(() => true);
                      portionCallback(0.441);

                      expect(fillStartPortionSpy).toHaveBeenCalledWith(0.441);

                      fillStartPortionSpy.mockRestore();
                      hasModSpy.mockRestore();
                    });
                  });
                  break;

                case 'rangeSecond':
                  // eslint-disable-next-line jest/no-identical-title
                  describe('range-slider_range_multiple is not applied', () => {
                    doesNotAffectTrackFields(() => false);
                  });

                  // eslint-disable-next-line jest/no-identical-title
                  describe('range-slider_range_multiple is applied', () => {
                    test('assigns an argument to the instance "track.fillEndPortion" field', () => {
                      const fillEndPortionSpy = jest.spyOn(
                        rangeSlider.track,
                        'fillEndPortion',
                        'set'
                      );
                      const hasModSpy = jest.spyOn(rangeSlider, 'hasMod');

                      hasModSpy.mockImplementation(() => true);
                      portionCallback(0.441);

                      expect(fillEndPortionSpy).toHaveBeenCalledWith(0.441);

                      fillEndPortionSpy.mockRestore();
                      hasModSpy.mockRestore();
                    });
                  });
                  break;
              }
            });
          });
        });
      });
    });
  });

  test('should apply range-slider__thumb_hidden modifier to the instance "thumbs.rangeFirst.rangeSliderThumb" entity', () => {
    const rangeSlider = instantiateRangeSlider($body).entity;

    testRangeSlider.hasModBeenApplied({
      mod: 'range-slider__thumb_hidden',
      to: rangeSlider.thumbs.rangeFirst.rangeSliderThumb
    });
  });

  test('should apply range-slider__thumb_hidden modifier to the instance "thumbs.rangeSecond.rangeSliderThumb" entity', () => {
    const rangeSlider = instantiateRangeSlider($body).entity;

    testRangeSlider.hasModBeenApplied({
      mod: 'range-slider__thumb_hidden',
      to: rangeSlider.thumbs.rangeSecond.rangeSliderThumb
    });
  });

  describe('should expose "genThumb" static method which returns an object containing the fields', () => {
    const track = instantiateTrack($body).entity;
    const $parent = $body;
    const portionCallback = jest.fn();

    const {
      createEntityCalls,
      addMixCalls
    } = mockBemToTrackCalls();

    const thumb = RangeSlider.genThumb({
      track,
      $parent,
      portionCallback
    });

    bemMockRestore();

    describe('"circle"', () => {
      describe('should be created via the bem "createEntity" method', () => {
        test('', () => {
          expect(createEntityCalls.map(call => call.result))
            .toContain(thumb.circle);
        });

        test('called with an arg having "Entity" field populated with Circle class', () => {
          const [testedCall] = createEntityCalls
            .filter(call => call.result === thumb.circle);

          expect(testedCall.args[0].Entity).toBe(Circle);
        });

        test('called with an arg having "$parent" field populated with the method corresponding arg field', () => {
          const [testedCall] = createEntityCalls
            .filter(call => call.result === thumb.circle);

          expect(testedCall.args[0].$parent).toBe($parent);
        });
      });

      test('should have applied circle_color_53b6a8 modifier', () => {
        testRangeSlider.hasModBeenApplied({
          mod: 'circle_color_53b6a8',
          to: thumb.circle
        });
      });

      test('should have applied hint_color_53b6a8 modifier for its "hint.hint" property', () => {
        testRangeSlider.hasModBeenApplied({
          mod: 'hint_color_53b6a8',
          to: thumb.circle.hint.hint
        });
      });
    });

    describe('"rangeSliderThumb"', () => {
      describe('should be created via the bem "addMix" method', () => {
        test('', () => {
          expect(addMixCalls.map(call => call.result))
            .toContain(thumb.rangeSliderThumb);
        });

        test('called with an arg having "Mix" field populated with RangeSliderThumb class', () => {
          const [testedCall] = addMixCalls
            .filter(call => call.result === thumb.rangeSliderThumb);

          expect(testedCall.args[0].Mix).toBe(RangeSliderThumb);
        });

        test('called with an arg having "entity" field populated with the value of the object "circle" field', () => {
          const [testedCall] = addMixCalls
            .filter(call => call.result === thumb.rangeSliderThumb);

          expect(testedCall.args[0].entity).toBe(thumb.circle);
        });
      });
    });

    describe('"portion"', () => {
      describe('setter', () => {
        test('should call the arg "portionCallback" function with a passed argument', () => {
          portionCallback.mockClear();

          thumb.portion = 9.44;
          expect(portionCallback).toHaveBeenLastCalledWith(9.44);
        });

        test('should assign a product of a passed argument and the arg "track.distancePx" to the object "rangeSliderThumb.marginPx"', () => {
          const distancePxSpy = jest.spyOn(
            track,
            'distancePx',
            'get'
          );
          const marginPxSpy = jest.spyOn(
            thumb.rangeSliderThumb,
            'marginPx',
            'set'
          );

          distancePxSpy.mockImplementation(() => 0.5);
          thumb.portion = 0.821;

          expect(marginPxSpy).toHaveBeenLastCalledWith(0.821 * 0.5);

          distancePxSpy.mockRestore();
          marginPxSpy.mockRestore();
        });
      });

      describe('getter', () => {
        test('should return previously set value or the default of null', () => {
          const freshThumb = RangeSlider.genThumb({
            track,
            $parent,
            portionCallback
          });

          expect(freshThumb.portion).toBe(null);

          freshThumb.portion = 0.6;
          expect(freshThumb.portion).toBe(0.6);

          freshThumb.portion = 0.1;
          expect(freshThumb.portion).toBe(0.1);
        });
      });
    });

    describe('"syncPortion"', () => {
      test('should be a function which assigns previously set "portion" value to the object "portion" field', () => {
        const freshThumb = RangeSlider.genThumb({
          track,
          $parent,
          portionCallback
        });
        const portionSpy = jest.spyOn(
          freshThumb,
          'portion',
          'set'
        );

        freshThumb.syncPortion();
        expect(portionSpy).toHaveBeenLastCalledWith(null);

        freshThumb.portion = 0.7;
        portionSpy.mockClear();
        freshThumb.syncPortion();

        expect(portionSpy).toHaveBeenLastCalledWith(0.7);

        freshThumb.portion = 0.911;
        portionSpy.mockClear();
        freshThumb.syncPortion();

        expect(portionSpy).toHaveBeenLastCalledWith(0.911);
      });
    });
  });

  describe('should expose "didMount" method', () => {
    describe('the method should set an interval', () => {
      describe('the interval should call "syncPortion" on each object from the instance "thumbs"', () => {
        test('if calling the instance "$html.width" or "$html.height" returns a value different from the previous one', () => {
          const rangeSlider = instantiateRangeSlider($body).entity;

          jest.useFakeTimers();
          rangeSlider.didMount();

          const widthMock = jest.spyOn(rangeSlider.$html, 'width');
          const heightMock = jest.spyOn(rangeSlider.$html, 'height');

          const syncPortionSpies = Object.values(rangeSlider.thumbs)
            .map(thumb => jest.spyOn(thumb, 'syncPortion'));

          widthMock.mockImplementation(() => 15);
          jest.runOnlyPendingTimers();

          syncPortionSpies.forEach((spy) => {
            expect(spy).toHaveBeenCalled();
          });

          syncPortionSpies.forEach((spy) => {
            spy.mockClear();
          });

          heightMock.mockImplementation(() => 21);
          jest.runOnlyPendingTimers();

          syncPortionSpies.forEach((spy) => {
            expect(spy).toHaveBeenCalled();
          });
        });
      });
    });
  });
});
