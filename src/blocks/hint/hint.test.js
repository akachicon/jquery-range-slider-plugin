const $ = require('jquery');
const bem = require('../../bem');
const Hint = require('./hint').default;
const hintContentModule = require('./__content/hint__content');
const {
  instantiateEntity: instantiateHint,
  removeEntities: removeHints,
  test: testHint
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

  describe('should instantiate children entities via createEntity', () => {
    describe('of type HintContent', () => {
      test('in the amount of 1', () => {
        testHint.doesContainChildren(hintContentModule, 1, $body);
      });

      test('accessible using the instance "content" field', () => {
        const createEntitySpy = jest.spyOn(bem, 'createEntity');
        const hint = instantiateHint($body);
        const createdEntities = createEntitySpy.mock.results
          .map(result => result.value);

        expect(createdEntities).toContain(hint.content);
      });
    });
  });

  test('should expose "text" setter which assigns an arg to the instance "content.text" field', () => {
    const hint = instantiateHint($body);
    const hintContentTextSpy = jest.spyOn(hint.content, 'text', 'set');

    hint.text = 'test-data';

    expect(hintContentTextSpy.mock.calls[0][0]).toBe('test-data');
  });

  test('should expose "text" getter which returns the instance "content.text" prop', () => {
    const hint = instantiateHint($body);
    const hintContentTextSpy = jest.spyOn(hint.content, 'text', 'get');

    hintContentTextSpy.mockImplementation(() => 'test-data');

    expect(hint.text).toBe('test-data');
  });
});
