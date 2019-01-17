const $ = require('jquery');
const { Modifiable } = require('../../src/bem');

let entityConfig;
let mountedEntities = [];

/**
 * @param {Object} config
 * @param {function} config.Entity
 * @param {string} config.tagName
 * @param {string} config.className
 */

module.exports = (config) => {
  if (config === undefined) {
    throw new Error('Entity config is not specified');
  }
  entityConfig = config;

  return {
    instantiateEntity,
    removeEntities,
    test
  };
};

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

const test = {
  doesExtendModifiable() {
    const entity = instantiateEntity($('<div></div>'));

    expect(entity instanceof Modifiable).toBeTruthy();
  },

  doesConformToTagName() {
    const setHtml = instantiateEntity($('<div></div>'), true);

    expect(setHtml.mock.calls[0][0].get(0).tagName).toBe(entityConfig.tagName);
  },

  doesConformToClassName() {
    const setHtml = instantiateEntity($('<div></div>'), true);

    expect(setHtml.mock.calls[0][0].hasClass(entityConfig.className)).toBeTruthy();
  }
};
