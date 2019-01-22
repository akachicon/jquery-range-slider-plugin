const $ = require('jquery');
const bem = require('../../bem');
const Circle = require('./circle').default;
const Hint = require('../hint/hint').default;
const CircleHint = require('./__hint/circle__hint').default;
const {
  instantiateEntity: instantiateCircle,
  removeEntities: removeCircles,
  test: testCircle
} = require('../../../test/bem/entity')({
  Entity: Circle,
  expected: {
    tagName: 'DIV',
    className: 'circle'
  }
});

const $body = $('body');

describe('Circle class', () => {
  beforeEach(() => {
    removeCircles();
  });

  test('should extend Modifiable', () => {
    testCircle.doesExtendModifiable();
  });

  describe('should call a passed first arg function in the constructor', () => {
    test('with a jquery div element', () => {
      testCircle.doesConformToTagName();
    });

    test('with a jquery element that has class "hint"', () => {
      testCircle.doesConformToClassName();
    });
  });

  describe('should instantiate child entities via createEntity', () => {
    describe('of type Hint', () => {
      describe('#1', () => {
        test('should be accessible using the instance "hint.hint" field', () => {
          // When retrieve mock.calls and mock.results they both contain
          // data in chronological order (which might be not the same).
          // So we need a way to match call args with corresponding results.

          const createEntityCalls = [];
          const { createEntity } = bem;
          const createEntitySpy = jest.spyOn(bem, 'createEntity');

          createEntitySpy.mockImplementation((...args) => {
            const result = createEntity(...args);

            createEntityCalls.push({
              args,
              result
            });

            return result;
          });

          const circle = instantiateCircle($body);

          expect(createEntityCalls.map(call => call.result))
            .toContain(circle.hint.hint);

          const [testedCall] = createEntityCalls
            .filter(call => call.result === circle.hint.hint);

          expect(testedCall.args[0].Entity).toBe(Hint);
          expect(testedCall.args[0].$parent).toBe(circle.$html);

          createEntitySpy.mockRestore();
        });

        describe('should have a mix created via addMix', () => {
          describe('of type CircleHint', () => {
            test('accessible using the instance "hint.circleHint" field', () => {
              const addMixCalls = [];
              const { addMix } = bem;
              const addMixSpy = jest.spyOn(bem, 'addMix');

              addMixSpy.mockImplementation((...args) => {
                const result = addMix(...args);

                addMixCalls.push({
                  args,
                  result
                });

                return result;
              });

              const circle = instantiateCircle($body);

              expect(addMixCalls.map(call => call.result))
                .toContain(circle.hint.circleHint);

              const [testedCall] = addMixCalls
                .filter(call => call.result === circle.hint.circleHint);

              expect(testedCall.args[0].Mix).toBe(CircleHint);
              expect(testedCall.args[0].entity).toBe(circle.hint.hint);

              addMixSpy.mockRestore();
            });
          });
        });
      });
    });
  });

  test('should expose "hintText" setter which assigns an arg to the instance "hint.hint.text" field', () => {
    const circle = instantiateCircle($body);
    const circleHintHintTextSpy = jest.spyOn(circle.hint.hint, 'text', 'set');
    const testData = 'test-data';

    circle.hintText = testData;

    expect(circleHintHintTextSpy).toHaveBeenCalledWith(testData);
  });

  test('should expose "hintText" getter which returns the instance "hint.hint.text" prop', () => {
    const circle = instantiateCircle($body);
    const circleHintHintTextSpy = jest.spyOn(circle.hint.hint, 'text', 'get');
    const testData = 'test-data';

    circleHintHintTextSpy.mockImplementation(() => testData);

    expect(circle.hintText).toBe(testData);
    expect(circleHintHintTextSpy).toHaveBeenCalled();
  });
});
