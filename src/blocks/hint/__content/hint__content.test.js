const $ = require('jquery');
const Hint = require('./hint__content').default;
const {
  instantiateEntity: instantiateHintContent,
  removeEntities: removeHintContents,
  testEntity: testHintContent
} = require('../../../../test/bem/entity')({
  Entity: Hint,
  expected: {
    tagName: 'DIV',
    className: 'hint__content'
  }
});

const $body = $('body');

describe('HintContent class', () => {
  beforeEach(() => {
    removeHintContents();
  });

  test('should extend Modifiable', () => {
    testHintContent.doesExtendModifiable();
  });

  describe('should call a passed first arg function in the constructor', () => {
    test('with a jquery div element', () => {
      testHintContent.doesConformToTagName();
    });

    test('with a jquery element that has class "hint__content"', () => {
      testHintContent.doesConformToClassName();
    });
  });

  test('should expose "text" setter which calls the instance "$html.text" function with its arg', () => {
    const hintContent = instantiateHintContent($body).entity;
    const htmlTextSpy = jest.spyOn(hintContent.$html, 'text');
    const testData = 'test-data';

    hintContent.text = testData;

    expect(htmlTextSpy).toHaveBeenCalledWith(testData);
  });

  test('should expose "text" getter which returns a call result of the instance "$html.text" function', () => {
    const hintContent = instantiateHintContent($body).entity;
    const htmlTextSpy = jest.spyOn(hintContent.$html, 'text');
    const testData = 'test-data';

    htmlTextSpy.mockImplementation(() => testData);

    expect(hintContent.text).toBe(testData);
    expect(htmlTextSpy).toHaveBeenCalled();
  });
});
