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

          test('only after the modifier css class corresponding to the prop was added to the "$html"', () => {
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

          test('only after the modifier css class corresponding to the prop was removed from the "$html"', () => {
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

          modifiable.$html = $('<div></div>');
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

  describe('createEntity function', () => {
    test('should call a passed entity constructor with a "setHtml" function as a first arg', () => {
      const Entity = class {
        constructor(setHtml) {
          expect(setHtml).toBeFunction();
        }
      };

      createEntity({
        Entity,
        $parent: $('<div></div>')
      });
    });

    test('should assign an html passed to the "setHtml" function to the "$html" instance prop', () => {
      const $html = $('<div></div>');
      const Entity = class {
        constructor(setHtml) {
          setHtml($html);
        }
      };
      const entity = createEntity({
        Entity,
        $parent: $('<div></div>')
      });

      expect(entity.$html).toBe($html);
    });

    test('should assign an html passed to the "$parent" arg prop to the "$parent" instance prop', () => {
      const $parent = $('<div></div>');
      const entity = createEntity({
        Entity: class {},
        $parent
      });

      expect(entity.$parent).toBe($parent);
    });

    test('should mount an html passed to the "setHtml" function to the $parent', () => {
      const $html = $('<div></div>');
      const $parent = $('<div></div>');
      const Entity = class {
        constructor(setHtml) {
          setHtml($html);
        }
      };
      const entity = createEntity({
        Entity,
        $parent
      });

      expect(entity.$html.parent().get(0)).toBe($parent.get(0));
    });

    describe('should call mounted entities\' "didMount" methods', () => {
      const BasicEntity = class {
        constructor(setHtml) {
          const $html = $('<div></div>');

          setHtml($html);
        }
      };
      const RegularEntity = class {
        constructor(setHtml) {
          const $html = $('<div></div>');

          this.child = createEntity({
            Entity: BasicEntity,
            $parent: $html
          });
          setHtml($html);
        }

        // eslint-disable-next-line class-methods-use-this
        didMount() {
          this.didMountCalled = true;
        }
      };

      test('for each entity which has the method', () => {
        const RootEntity = class {
          constructor(setHtml) {
            const $html = $('<div></div>');

            this.child = createEntity({
              Entity: RegularEntity,
              $parent: $html
            });
            setHtml($html);
          }

          // eslint-disable-next-line class-methods-use-this
          didMount() {
            this.didMountCalled = true;
          }
        };

        const $parent = $('<div></div>');
        const rootEntity = createEntity({
          Entity: RootEntity,
          $parent
        });

        expect(rootEntity.didMountCalled).toBeTruthy();
        expect(rootEntity.child.didMountCalled).toBeTruthy();
      });

      test('only after root entity was mounted', () => {
        const RootEntity = class {
          constructor(setHtml) {
            const $html = $('<div></div>');

            this.child = createEntity({
              Entity: RegularEntity,
              $parent: $html
            });

            expect(this.child.didMountCalled).toBeFalsy();

            setHtml($html);
          }

          // eslint-disable-next-line class-methods-use-this
          didMount() {
            this.didMountCalled = true;
          }
        };

        const $parent = $('<div></div>');
        const rootEntity = createEntity({
          Entity: RootEntity,
          $parent
        });

        expect(rootEntity.didMountCalled).toBeTruthy();
        expect(rootEntity.child.didMountCalled).toBeTruthy();
      });
    });

    test('should return created entity instance', () => {
      const Entity = class {
        constructor(setHtml) {
          const $html = $('<div></div>');

          this.created = true;
          setHtml($html);
        }
      };
      const entity = createEntity({
        Entity,
        $parent: $('<div></div>')
      });

      expect(entity.created).toBeTruthy();
    });
  });

  describe('addMix function', () => {
    const entity = {
      $html: $('<div></div>'),
      $parent: $('<div></div>')
    };
    const Mix = class {
      constructor($html) {
        this.created = true;

        expect($html).toBe(entity.$html);
      }
    };

    test('should call a passed mix constructor with a passed entity\'s "$html" prop as a first arg', () => {
      addMix({
        entity,
        Mix,
      });
    });

    test('should assign the passed entity\'s "$html" prop to the mix instance "$html" prop', () => {
      const mix = addMix({
        entity,
        Mix,
      });

      expect(mix.$html).toBe(entity.$html);
    });

    test('should assign the passed entity\'s "$parent" prop to the mix instance "$parent" prop', () => {
      const mix = addMix({
        entity,
        Mix,
      });

      expect(mix.$parent).toBe(entity.$parent);
    });

    test('should return created mix instance', () => {
      const mix = addMix({
        entity,
        Mix,
      });

      expect(mix.created).toBeTruthy();
    });
  });
});

/* eslint-disable global-require */
