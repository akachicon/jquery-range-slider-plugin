const bem = require('../../src/bem');

bem.__test__ = {
  origin: {
    createEntity: bem.createEntity,
    addMix: bem.addMix
  }
};

jest.spyOn(bem, 'createEntity');
jest.spyOn(bem, 'addMix');
jest.spyOn(bem.Modifiable.prototype, 'applyMod');
jest.spyOn(bem.Modifiable.prototype, 'removeMod');

jest.doMock('../../src/bem', () => bem);
