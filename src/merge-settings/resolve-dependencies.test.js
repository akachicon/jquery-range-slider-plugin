import resolveDeps from './resolve-dependencies';

// This test suite is based on the current dependency graph

describe('dependency resolver', () => {
  test('should resolve correctly', () => {
    let resolvedDeps = resolveDeps({
      min: '',
      step: '',
      range: '',
      hint: '',
    });

    expect(resolvedDeps).toIncludeAllMembers(['min', 'step', 'range', 'hint', 'value', 'values', 'marks']);
    expect(resolvedDeps[0]).toBe('min');
    expect(resolvedDeps.length).toBe(7);

    resolvedDeps = resolveDeps({
      min: '',
      step: '',
      value: '',
      hint: '',
    });

    expect(resolvedDeps).toIncludeAllMembers(['min', 'max', 'step', 'hint', 'value', 'values', 'marks']);
    expect(resolvedDeps.slice(0, 2)).toIncludeAllMembers(['min', 'max']);
    expect(resolvedDeps.length).toBe(7);

    resolvedDeps = resolveDeps({
      min: '',
      step: '',
      value: '',
      values: '',
      hint: '',
    });

    expect(resolvedDeps).toIncludeAllMembers(['min', 'max', 'step', 'hint', 'value', 'values', 'marks']);
    expect(resolvedDeps.slice(0, 2)).toIncludeAllMembers(['min', 'max']);
    expect(resolvedDeps.length).toBe(7);

    resolvedDeps = resolveDeps({
      step: '',
      orientation: '',
      hint: '',
    });

    expect(resolvedDeps).toIncludeAllMembers(['step', 'orientation', 'hint']);
    expect(resolvedDeps.length).toBe(3);
  });
});
