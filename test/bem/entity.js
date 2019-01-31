// It's expected that <rootDir>/test/bem will be executed before this module called

const $ = require('jquery');
const bem = require('../../src/bem');
const {
  mockBemToTrackCalls,
  bemMockRestore
} = require('./index');

/**
 * @param {Object} entityConfig
 * @param {Constructor} entityConfig.Entity
 * @param {Object} [entityConfig.expected]
 * @param {string} [entityConfig.expected.tagName]
 * @param {string} [entityConfig.expected.className]
 */

module.exports = (entityConfig) => {
  if (entityConfig === undefined) {
    throw new Error('Entity config is not specified');
  }
  let mountedEntities = [];

  const instantiateEntity = ($parent) => {
    const {
      createEntityCalls,
      addMixCalls
    } = mockBemToTrackCalls();
    const { Entity } = entityConfig;
    const setHtml = jest.fn();
    const entity = new Entity(setHtml);

    bemMockRestore();

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

  const instantiateMixEntity = (baseEntity) => {
    const entity = new entityConfig.Entity(baseEntity.$html);

    entity.$html = baseEntity.$html;
    entity.$parent = baseEntity.$parent;

    return { entity };
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

  const getObjectWithAccessor = (origin, acc) => {
    if (acc === '') return origin;

    return acc.split('.').reduce(
      (obj, accEntry) => obj[accEntry],
      origin
    );
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

  return {
    instantiateEntity,
    instantiateMixEntity,
    removeEntities,
    applyMod,
    removeMod,
    testEntity
  };
};
