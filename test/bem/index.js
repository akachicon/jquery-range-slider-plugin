const bem = require('../../src/bem');

bem.__test__ = {
  origin: {
    createEntity: bem.createEntity,
    addMix: bem.addMix
  }
};

jest.spyOn(bem, 'createEntity');
jest.spyOn(bem, 'addMix');

jest.doMock('../../src/bem', () => bem);
