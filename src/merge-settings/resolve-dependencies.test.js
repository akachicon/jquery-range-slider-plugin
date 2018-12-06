import resolveDeps from './resolve-dependencies';

// This test suite is based on the current dependency graph

describe('dependency resolver', () => {
  let resolvedDeps = [];
  const iof = key => resolvedDeps.indexOf(key);

  test('#1', () => {
    resolvedDeps = resolveDeps({
      min: '',
    });

    expect(resolvedDeps).toIncludeAllMembers(['min', 'max', 'step', 'value', 'values', 'marks']);
    expect(resolvedDeps.length).toBe(6);

    ['value', 'values', 'marks'].forEach((key) => {
      expect(iof('min')).toBeLessThan(iof(key));
      expect(iof('max')).toBeLessThan(iof(key));
    });

    ['value', 'values'].forEach((key) => {
      expect(iof('step')).toBeLessThan(iof(key));
    });
  });

  test('#2', () => {
    resolvedDeps = resolveDeps({
      step: ''
    });

    expect(resolvedDeps).toIncludeAllMembers(['min', 'max', 'step', 'value', 'values']);
    expect(resolvedDeps.length).toBe(5);

    ['value', 'values'].forEach((key) => {
      expect(iof('min')).toBeLessThan(iof(key));
      expect(iof('max')).toBeLessThan(iof(key));
      expect(iof('step')).toBeLessThan(iof(key));
    });
  });

  test('#3', () => {
    resolvedDeps = resolveDeps({
      value: ''
    });

    expect(resolvedDeps).toIncludeAllMembers(['min', 'max', 'step', 'value']);
    expect(resolvedDeps.length).toBe(4);
    expect(iof('value')).toBe(3);
  });

  test('#4', () => {
    resolvedDeps = resolveDeps({
      marks: ''
    });

    expect(resolvedDeps).toIncludeAllMembers(['min', 'max', 'marks']);
    expect(resolvedDeps.length).toBe(3);
    expect(iof('marks')).toBe(2);
  });

  test('#5', () => {
    resolvedDeps = resolveDeps({
      max: '',
      hint: '',
      orientation: '',
      values: ''
    });

    expect(resolvedDeps).toIncludeAllMembers(['min', 'max', 'step', 'value', 'values', 'marks', 'orientation', 'hint']);
    expect(resolvedDeps.length).toBe(8);

    ['value', 'values', 'marks'].forEach((key) => {
      expect(iof('min')).toBeLessThan(iof(key));
      expect(iof('max')).toBeLessThan(iof(key));
    });

    ['value', 'values'].forEach((key) => {
      expect(iof('step')).toBeLessThan(iof(key));
    });
  });
});
