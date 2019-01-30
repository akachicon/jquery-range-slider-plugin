const $ = require('jquery');
const RangeSlider = require('./range-slider').default;
const RangeSliderThumb = require('./__thumb/range-slider__thumb');
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
});
