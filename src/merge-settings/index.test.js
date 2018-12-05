/* eslint-disable global-require */
let resolveDeps;
let refiners;
let mergeSettings;

describe('merger', () => {
  beforeEach(() => {
    jest.resetModules();

    jest.mock('./resolve-dependencies', () => jest.fn());
    resolveDeps = require('./resolve-dependencies');
    // resolveDeps should return an array
    resolveDeps.mockImplementation(() => []);

    jest.mock('./refiners', () => ({}));
    refiners = require('./refiners');

    mergeSettings = require('./index').default;
  });

  describe('should call', () => {
    test('the dependecy resolver with first argument or its clone', () => {
      const options01 = {
        first: 1,
        second: 'second',
        third: true,
        fourth: [0, '1'],
        fifth: null,
        sixth: undefined
      };
      const options02 = {
        first: {
          second: [1, '2'],
          third: {
            sixth: {
              seventh: [{ eighth: [1, true] }],
              ninth: 'end'
            }
          }
        }
      };

      mergeSettings(options01, {});
      mergeSettings(options02, {});

      expect(resolveDeps.mock.calls[0][0]).toEqual(options01);
      expect(resolveDeps.mock.calls[1][0]).toEqual(options02);
    });

    describe('all refinres returned by the dependency resolver', () => {
      test('in an appropriate order', () => {
        jest.resetModules();

        jest.mock('./resolve-dependencies', () => jest.fn());
        resolveDeps = require('./resolve-dependencies');

        const refinersExports = {};
        let buffer = [];

        // eslint-disable-next-line no-return-assign
        [1, 2, 3, 4, 5, 6].forEach(i => (
          refinersExports[i] = () => buffer.push(`${i}`)
        ));
        // eslint-disable-next-line no-return-assign
        refinersExports.reset = () => (buffer = []);
        refinersExports.getCallData = () => buffer;

        jest.setMock('./refiners', refinersExports);
        refiners = require('./refiners');
        mergeSettings = require('./index').default;

        [
          ['1', '2'],
          ['2', '1', '3'],
          ['4', '6', '1', '5']
        ].forEach((resolveArr) => {
          resolveDeps.mockImplementation(() => resolveArr);

          mergeSettings({}, {});
          expect(refiners.getCallData()).toEqual(resolveArr);

          refiners.reset();
        });
      });

      test('with refiners results merged into first argument (except null) and second argument or their clones', () => {
        jest.resetModules();

        jest.mock('./resolve-dependencies', () => jest.fn());
        resolveDeps = require('./resolve-dependencies');
        resolveDeps.mockImplementation(() => ['1', '2', '3']);

        const refinersExports = {
          1: jest.fn(() => ({ test: true })),
          2: jest.fn(() => null),
          3: jest.fn(() => 3)
        };

        jest.setMock('./refiners', refinersExports);
        refiners = require('./refiners');
        mergeSettings = require('./index').default;

        const arg1 = {
          some: 'data',
          1: {
            data: ''
          }
        };
        const arg2 = {};
        const expectedArg1 = { ...arg1 };

        mergeSettings(arg1, arg2);

        [1, 2, 3].forEach((i) => {
          if (i === 2) expectedArg1['1'] = { test: true };

          expect(refinersExports[`${i}`].mock.calls[0][0]).toEqual(expectedArg1);
          expect(refinersExports[`${i}`].mock.calls[0][1]).toEqual(arg2);
        });
      });
    });
  });

  describe('should return', () => {
    test('undefined when passed a non-object value as a first or second argument', () => {
      expect(mergeSettings()).toBeUndefined();
      expect(mergeSettings({})).toBeUndefined();
      expect(mergeSettings({}, true)).toBeUndefined();
      expect(mergeSettings('1', {})).toBeUndefined();
      expect(mergeSettings(1, '0')).toBeUndefined();
    });

    describe('results from refiners merged into a provided second argument in a shallow fashion', () => {
      let incoming;
      let current;
      let expectations;

      const configureTests = () => {
        incoming = [{}, {}];
        current = [{
          first: 1,
          second: 'second',
          third: true,
          fourth: [0, '1'],
          fifth: null,
          sixth: undefined
        }, {
          first: {
            second: [1, '2'],
          },
          third: {},
          fourth: {
            sixth: [{ seventh: [1, true] }],
            eighth: 'end'
          },
          ninth: {
            tenth: false
          }
        }];

        jest.resetModules();

        jest.mock('./resolve-dependencies', () => jest.fn());
        resolveDeps = require('./resolve-dependencies');
        resolveDeps.mockImplementation(() => ['second', 'third', 'fourth', 'fifth']);

        const refinersExports = {
          second() {
            return [1, '2'];
          },
          third() {
            return [];
          },
          fourth() {
            return { eight: 'end' };
          },
          fifth() {
            return false;
          }
        };

        jest.setMock('./refiners', refinersExports);
        mergeSettings = require('./index').default;

        expectations = [
          {
            ...current[0],
            ...{
              second: [1, '2'],
              third: [],
              fourth: { eight: 'end' },
              fifth: false
            },
          }, {
            ...current[1],
            ...{
              second: [1, '2'],
              third: [],
              fourth: { eight: 'end' },
              fifth: false
            }
          }
        ];
      };

      beforeEach(() => configureTests());

      test('without clonnig', () => {
        [0, 1].forEach((i) => {
          const result = mergeSettings(incoming[i], current[i]);

          expect(result).toEqual(expectations[i]);
          expect(result).toBe(current[i]);
        });
      });

      test('with clonnig', () => {
        [0, 1].forEach((i) => {
          const result = mergeSettings(incoming[i], current[i], true);

          expect(result).toEqual(expectations[i]);
          expect(result).not.toBe(current[i]);
          if (result.ninth) {
            expect(result.ninth).not.toBe(current[i].ninth);
          }
        });
      });
    });
  });
});
