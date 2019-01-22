const $ = require('jquery');
const bem = require('../../src/bem');

let entityConfig;
let mountedEntities = [];

/**
 * @param {Object} config
 * @param {function} config.Entity
 * @param {Object} config.expected
 * @param {string} config.expected.tagName
 * @param {string} config.expected.className
 */

module.exports = (config) => {
  if (config === undefined) {
    throw new Error('Entity config is not specified');
  }
  entityConfig = config;

  return {
    jestifyConstructor,
    instantiateEntity,
    removeEntities,
    applyMod,
    removeMod,
    test
  };
};

const jestifyConstructor = Constructor => (
  function JestifiedConstructor(...args) {
    return new Constructor(...args);
  }
);

const instantiateEntity = ($parent, returnHtmlSetterMock) => {
  const setHtml = jest.fn();
  const { Entity } = entityConfig;
  const entity = new Entity(setHtml);

  [[entity.$html]] = setHtml.mock.calls;
  entity.$html.appendTo($parent);
  entity.$parent = $parent;
  mountedEntities.push(entity);

  if (returnHtmlSetterMock) {
    return setHtml;
  }

  return entity;
};

const removeEntities = () => {
  mountedEntities.forEach((entity) => {
    entity.$html.remove();
  });
  mountedEntities = [];
};

const applyMod = (entity, modifier) => {
  modifier.apply.call(entity);
};

const removeMod = (entity, modifier) => {
  modifier.remove.call(entity);
};

const test = {
  doesExtendModifiable() {
    const entity = instantiateEntity($('<div></div>'));

    expect(entity).toBeInstanceOf(bem.Modifiable);
  },

  doesConformToTagName() {
    const setHtml = instantiateEntity($('<div></div>'), true);

    expect(setHtml.mock.calls[0][0].get(0).tagName)
      .toBe(entityConfig.expected.tagName);
  },

  doesConformToClassName() {
    const setHtml = instantiateEntity($('<div></div>'), true);

    expect(setHtml.mock.calls[0][0].hasClass(entityConfig.expected.className))
      .toBeTruthy();
  },

  doesContainChildren(childEntityModule, amount) {
    const $testEntityParent = $('<div></div>');
    const createEntitySpy = jest.spyOn(bem, 'createEntity');
    const entitySetHtmlMock = instantiateEntity($testEntityParent, true);
    const [[$entityHtml]] = entitySetHtmlMock.mock.calls;

    let createEntityChildCallCount = 0;

    createEntitySpy.mock.calls.forEach(([arg]) => {
      if (arg.Entity === childEntityModule.default
          && arg.$parent.get(0) === $entityHtml.get(0)) {
        createEntityChildCallCount += 1;
      }
    });

    expect(createEntityChildCallCount).toBe(amount);
  },

  doesContainMix(baseEntityModule, mixEntityModule, amount) {

  }
};
