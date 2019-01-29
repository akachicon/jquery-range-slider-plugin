const $ = require('jquery');
const Circle = require('./circle').default;
const Hint = require('../hint/hint').default;
const CircleHint = require('./__hint/circle__hint').default;
const {
  instantiateEntity: instantiateCircle,
  removeEntities: removeCircles,
  testEntity: testCircle
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

    test('with a jquery element that has class "circle"', () => {
      testCircle.doesConformToClassName();
    });
  });

  describe('should instantiate child entities via the bem "createEntity" method', () => {
    describe('of type Hint', () => {
      describe('#1', () => {
        test('should be accessible using the instance "hint.hint" field', () => {
          testCircle.doesSpawnEntity({
            Entity: Hint,
            accessor: 'hint.hint',
            parentAccessor: ''
          });
        });

        describe('should have a mix created via the bem "addMix" method', () => {
          describe('of type CircleHint', () => {
            test('accessible using the instance "hint.circleHint" field', () => {
              testCircle.doesMixEntities({
                Mix: CircleHint,
                baseAccessor: 'hint.hint',
                mixAccessor: 'hint.circleHint'
              });
            });
          });
        });
      });
    });
  });

  describe('should expose "hintText" getter/setter', () => {
    describe('setter', () => {
      test('should assign an arg to the instance "hint.hint.text" field', () => {
        const circle = instantiateCircle($body).entity;
        const hintTextSpy = jest.spyOn(circle.hint.hint, 'text', 'set');
        const testData = 'test-data';

        circle.hintText = testData;

        expect(hintTextSpy).toHaveBeenCalledWith(testData);
      });
    });

    describe('getter', () => {
      test('should return the instance "hint.hint.text" value', () => {
        const circle = instantiateCircle($body).entity;
        const hintTextSpy = jest.spyOn(circle.hint.hint, 'text', 'get');
        const testData = 'test-data';

        hintTextSpy.mockImplementation(() => testData);

        expect(circle.hintText).toBe(testData);
        expect(hintTextSpy).toHaveBeenCalled();
      });
    });
  });
});
