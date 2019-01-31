const bem = require('../../src/bem');

const origin = {
  createEntity: bem.createEntity,
  addMix: bem.addMix
};

jest.spyOn(bem, 'createEntity');
jest.spyOn(bem, 'addMix');
jest.spyOn(bem.Modifiable.prototype, 'applyMod');
jest.spyOn(bem.Modifiable.prototype, 'removeMod');

jest.doMock('../../src/bem', () => bem);

module.exports = {
  mockBemToTrackCalls() {
    // When retrieve mock.calls and mock.results they both contain
    // data in chronological order (which might not be the same).
    // So we need a way to match call args with their corresponding results.

    const upgradeBemMethodToTrackCalls = (method) => {
      const callStore = [];

      bem[method].mockImplementation((...args) => {
        const result = origin[method](...args);

        callStore.push({
          args,
          result
        });

        return result;
      });

      return callStore;
    };

    return {
      createEntityCalls: upgradeBemMethodToTrackCalls('createEntity'),
      addMixCalls: upgradeBemMethodToTrackCalls('addMix')
    };
  },

  bemMockRestore() {
    Object.keys(origin).forEach((method) => {
      bem[method].mockReset();
      bem[method].mockImplementation(origin[method]);
    });
  }
};
