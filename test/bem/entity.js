// It's expected that <rootDir>/test/bem will be executed before this module called

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
    instantiateEntity,
    removeEntities,
    applyMod,
    removeMod,
    testEntity
  };
};

const instantiateEntity = ($parent) => {
  const { Entity } = entityConfig;
  const setHtml = jest.fn();

  // When retrieve mock.calls and mock.results they both contain
  // data in chronological order (which might not be the same).
  // So we need a way to match call args with their corresponding results.

  const upgradeBemMethodToTrackCalls = (method) => {
    const callStore = [];

    bem[method].mockImplementation((...args) => {
      // Cause jest.requireActual does not work here the origin is used
      const result = bem.__test__.origin[method](...args);

      callStore.push({
        args,
        result
      });

      return result;
    });

    return callStore;
  };

  const createEntityCalls = upgradeBemMethodToTrackCalls('createEntity');
  const addMixCalls = upgradeBemMethodToTrackCalls('addMix');
  const entity = new Entity(setHtml);

  // It executes some part of the bem contract
  // but does not test the bem behaviour

  [[entity.$html]] = setHtml.mock.calls;
  entity.$html.appendTo($parent);
  entity.$parent = $parent;
  mountedEntities.push(entity);

  return {
    entity,
    setHtml,
    createEntityCalls,
    addMixCalls
  };
};

const instantiateMixEntity = baseEntity => ({
  entity: new entityConfig.Entity(baseEntity.$html)
});

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

const testEntity = {
  doesExtendModifiable() {
    const { entity } = instantiateEntity($('<div></div>'));

    expect(entity).toBeInstanceOf(bem.Modifiable);
  },

  doesMixExtendModifiable() {
    const { entity } = instantiateMixEntity({ $html: $('<div></div>') });

    expect(entity).toBeInstanceOf(bem.Modifiable);
  },

  doesConformToClassName() {
    const { setHtml } = instantiateEntity($('<div></div>'));

    expect(setHtml.mock.calls[0][0].hasClass(entityConfig.expected.className))
      .toBeTruthy();
  },

  doesMixConformToClassName() {
    const $html = $('<div></div>');

    instantiateMixEntity({ $html });

    expect($html.hasClass(entityConfig.expected.className))
      .toBeTruthy();
  },

  doesConformToTagName() {
    const { setHtml } = instantiateEntity($('<div></div>'));

    expect(setHtml.mock.calls[0][0].get(0).tagName)
      .toBe(entityConfig.expected.tagName);
  },

  doesSpawnEntity({
    Entity,
    accessor,
    parentAccessor
  }) {
    const {
      entity,
      createEntityCalls
    } = instantiateEntity($('<div></div>'));
    const descendant = getObjectWithAccessor(entity, accessor);

    expect(createEntityCalls.map(call => call.result))
      .toContain(descendant);

    const [testedCall] = createEntityCalls
      .filter(call => call.result === descendant);

    expect(testedCall.args[0].Entity).toBe(Entity);

    if (parentAccessor === undefined) return;

    expect(descendant.$parent).toBe(
      getObjectWithAccessor(entity, parentAccessor).$html
    );
  },

  doesMixEntities({
    Mix,
    baseAccessor,
    mixAccessor
  }) {
    const {
      entity,
      addMixCalls
    } = instantiateEntity($('<div></div>'));
    const base = getObjectWithAccessor(entity, baseAccessor);
    const mix = getObjectWithAccessor(entity, mixAccessor);

    expect(addMixCalls.map(call => call.result))
      .toContain(mix);

    const [testedCall] = addMixCalls
      .filter(call => call.result === mix);

    expect(testedCall.args[0].Mix).toBe(Mix);
    expect(testedCall.args[0].entity).toBe(base);
  },

  hasModBeenApplied({ mod, to }) {
    const { applyMod: apply } = bem.Modifiable.prototype;
    const contexts = apply.mock.instances;

    expect(contexts).toContain(to);

    let satisfied = false;

    for (let idx = 0; idx < contexts.length; idx += 1) {
      if (contexts[idx] === to
          && apply.mock.calls[idx][0] === mod) {
        satisfied = true;

        break;
      }
    }

    expect(satisfied).toBeTruthy();
  },

  doesApply(modifier, subModifier, toAccessor) {
    const { entity } = instantiateEntity($('<div></div>'));
    const applyModSpy = jest.spyOn(
      getObjectWithAccessor(entity, toAccessor),
      'applyMod'
    );

    applyMod(entity, modifier);

    expect(applyModSpy).toHaveBeenCalledWith(subModifier);
  },

  doesRemove(modifier, subModifier, fromAccessor) {
    const { entity } = instantiateEntity($('<div></div>'));
    const removeModSpy = jest.spyOn(
      getObjectWithAccessor(entity, fromAccessor),
      'removeMod'
    );

    removeMod(entity, modifier);

    expect(removeModSpy).toHaveBeenCalledWith(subModifier);
  }
};

const getObjectWithAccessor = (origin, acc) => {
  if (acc === '') return origin;

  return acc.split('.').reduce(
    (obj, accEntry) => obj[accEntry],
    origin
  );
};
