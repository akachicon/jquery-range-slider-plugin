/* eslint-disable global-require */
const $ = require('jquery');
const { Modifiable, createEntity, addMix } = require('./bem');

describe('bem', () => {
  describe('Modifiable class', () => {
    describe('should provide instance methods', () => {
      describe('applyMod', () => {
        test('adds specified css classes to a jquery dom element stored in the "$html" instance property field', () => {
          const modifiable = new Modifiable();
          const $html = $('<div></div>');

          modifiable.$html = $html;
          modifiable.applyMod('mod1');

          expect($html.hasClass('mod1')).toBeTruthy();

          modifiable.applyMod('mod2 mod3');

          expect($html.hasClass('mod1')).toBeTruthy();
          expect($html.hasClass('mod2')).toBeTruthy();
          expect($html.hasClass('mod3')).toBeTruthy();
        });

        describe('calls "apply" method in context of the instance for instance props (not necessarily own)', () => {
          const Extended = class extends Modifiable {};
          const $html = $('<div></div>');

          Object.assign(Extended.prototype, {
            mod1: {
              apply() {},
              remove() {}
            },
            mod2: {
              apply() {},
              remove() {}
            },
            mod3: {
              apply() {},
              remove() {}
            }
          });

          const modSpy1 = jest.spyOn(Extended.prototype.mod1, 'apply');
          const modSpy2 = jest.spyOn(Extended.prototype.mod2, 'apply');
          const modSpy3 = jest.spyOn(Extended.prototype.mod3, 'apply');
          const extendedModifiable = new Extended();

          extendedModifiable.$html = $html;

          test('if the prop exists and its name is equal to the specified modifier name', () => {
            extendedModifiable.applyMod('mod1');

            expect(modSpy1).toHaveBeenCalled();
            expect(modSpy1.mock.instances[0]).toBe(extendedModifiable);

            extendedModifiable.applyMod('mod2 mod3');

            expect(modSpy2).toHaveBeenCalled();
            expect(modSpy2.mock.instances[0]).toBe(extendedModifiable);
            expect(modSpy3).toHaveBeenCalled();
            expect(modSpy3.mock.instances[0]).toBe(extendedModifiable);
          });

          test('only if the modifier corresponding to the prop was not previously added or added but removed', () => {
            extendedModifiable.applyMod('mod1');

            expect(modSpy1).toHaveBeenCalledTimes(1);

            extendedModifiable.removeMod('mod1');
            extendedModifiable.applyMod('mod1');

            expect(modSpy1).toHaveBeenCalledTimes(2);
            expect(modSpy1.mock.instances[1]).toBe(extendedModifiable);
          });

          test('only after the modifier css class corresponding to the prop was added to "$html"', () => {
            Extended.prototype.mod4 = {
              apply() {
                expect(extendedModifiable.$html.hasClass('mod4'))
                  .toBeTruthy();
              },
              remove() {}
            };
            extendedModifiable.applyMod('mod4');
          });
        });
      });

      describe('removeMod', () => {
        test('removes specified css classes from a jquery dom element stored in the "$html" instance property field', () => {
          const modifiable = new Modifiable();
          const $html = $('<div class="mod1 mod2 mod3"></div>');

          modifiable.$html = $html;
          modifiable.removeMod('mod1');

          expect($html.hasClass('mod1')).toBeFalsy();
          expect($html.hasClass('mod2')).toBeTruthy();
          expect($html.hasClass('mod3')).toBeTruthy();

          modifiable.removeMod('mod2 mod3');

          expect($html.hasClass('mod1')).toBeFalsy();
          expect($html.hasClass('mod2')).toBeFalsy();
          expect($html.hasClass('mod3')).toBeFalsy();
        });

        describe('calls "remove" method in context of the instance for instance props (not necessarily own)', () => {
          const Extended = class extends Modifiable {};
          const $html = $('<div></div>');

          Object.assign(Extended.prototype, {
            mod1: {
              apply() {},
              remove() {}
            },
            mod2: {
              apply() {},
              remove() {}
            },
            mod3: {
              apply() {},
              remove() {}
            }
          });

          const modSpy1 = jest.spyOn(Extended.prototype.mod1, 'remove');
          const modSpy2 = jest.spyOn(Extended.prototype.mod2, 'remove');
          const modSpy3 = jest.spyOn(Extended.prototype.mod3, 'remove');
          const extendedModifiable = new Extended();

          extendedModifiable.$html = $html;
          extendedModifiable.applyMod('mod1 mod2 mod3');

          test('if the prop exists and its name is equal to the specified modifier name', () => {
            extendedModifiable.removeMod('mod1');

            expect(modSpy1).toHaveBeenCalled();
            expect(modSpy1.mock.instances[0]).toBe(extendedModifiable);

            extendedModifiable.removeMod('mod2 mod3');

            expect(modSpy2).toHaveBeenCalled();
            expect(modSpy2.mock.instances[0]).toBe(extendedModifiable);
            expect(modSpy3).toHaveBeenCalled();
            expect(modSpy3.mock.instances[0]).toBe(extendedModifiable);
          });

          test('only if the modifier corresponding to the prop was added but not removed', () => {
            extendedModifiable.removeMod('mod1');

            expect(modSpy1).toHaveBeenCalledTimes(1);

            extendedModifiable.applyMod('mod1');
            extendedModifiable.removeMod('mod1');

            expect(modSpy1).toHaveBeenCalledTimes(2);
            expect(modSpy1.mock.instances[1]).toBe(extendedModifiable);
          });

          test('only after the modifier css class corresponding to the prop was removed from "$html"', () => {
            Extended.prototype.mod4 = {
              apply() {},
              remove() {
                expect(extendedModifiable.$html.hasClass('mod4'))
                  .toBeFalsy();
              }
            };
            extendedModifiable.removeMod('mod4');
          });
        });
      });

      describe('hasMod', () => {
        test('returns true if the modifier was applied but not removed', () => {
          const modifiable = new Modifiable();

          modifiable.$html = $('<div></div>');;
          modifiable.applyMod('mod1');

          expect(modifiable.hasMod('mod1')).toBeTruthy();

          modifiable.applyMod('mod2 mod3');

          expect(modifiable.hasMod('mod1')).toBeTruthy();
          expect(modifiable.hasMod('mod2')).toBeTruthy();
          expect(modifiable.hasMod('mod3')).toBeTruthy();

          modifiable.removeMod('mod1');

          expect(modifiable.hasMod('mod1')).toBeFalsy();
          expect(modifiable.hasMod('mod2')).toBeTruthy();
          expect(modifiable.hasMod('mod3')).toBeTruthy();
        });
      });
    });

    describe('should provide static methods', () => {
      describe('extractNames', () => {
        const { extractNames } = Modifiable;

        test('returns argument as is if the argument is of type String', () => {
          expect(extractNames('mod1 mod2 mod3'))
            .toBe('mod1 mod2 mod3');
        });

        test('returns string produced by first arg entries concatenated with " " if the argument is of type Array', () => {
          expect(extractNames(['mod1', 'mod2', 'mod3']))
            .toBe('mod1 mod2 mod3');
        });
      });
    });
  });

  describe('createEntity', () => {

  });
});

/* eslint-disable global-require */
