const $ = require('jquery');
const Hint = require('./hint').default;
const HintContent = require('./__content/hint__content').default;
const {
  instantiateEntity: instantiateHint,
  removeEntities: removeHints,
  testEntity: testHint
} = require('../../../test/bem/entity')({
  Entity: Hint,
  expected: {
    tagName: 'DIV',
    className: 'hint'
  }
});

const $body = $('body');

describe('Hint class', () => {
  beforeEach(() => {
    removeHints();
  });

  test('should extend Modifiable', () => {
    testHint.doesExtendModifiable();
  });

  describe('should call a passed first arg function in the constructor', () => {
    test('with a jquery div element', () => {
      testHint.doesConformToTagName();
    });

    test('with a jquery element that has class "hint"', () => {
      testHint.doesConformToClassName();
    });
  });

  describe('should instantiate child entities via createEntity', () => {
    describe('of type HintContent', () => {
      describe('#1', () => {
        test('should be accessible using the instance "content" field', () => {
          testHint.doesSpawnEntity({
            Entity: HintContent,
            accessor: 'content',
            parentAccessor: ''
          });
        });
      });
    });
  });

  test('should expose "text" setter which assigns an arg to the instance "content.text" field', () => {
    const hint = instantiateHint($body).entity;
    const contentTextSpy = jest.spyOn(hint.content, 'text', 'set');
    const testData = 'test-data';

    hint.text = testData;

    expect(contentTextSpy).toHaveBeenCalledWith(testData);
  });

  test('should expose "text" getter which returns the instance "content.text" prop', () => {
    const hint = instantiateHint($body).entity;
    const contentTextSpy = jest.spyOn(hint.content, 'text', 'get');
    const testData = 'test-data';

    contentTextSpy.mockImplementation(() => testData);

    expect(hint.text).toBe(testData);
    expect(contentTextSpy).toHaveBeenCalled();
  });
});
