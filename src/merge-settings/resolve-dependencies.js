const forwardDeps = {
  min: null,
  max: null,
  step: null,
  range: null,
  hint: null,
  orientation: null,
  value: ['min', 'max', 'step'],
  values: ['min', 'max', 'step'],
  marks: ['min', 'max'],
  enabled: null
};

const backwardDeps = {
  min: ['value', 'values', 'marks'],
  max: ['value', 'values', 'marks'],
  step: ['value', 'values'],
  range: null,
  hint: null,
  orientation: null,
  value: null,
  values: null,
  marks: null,
  enabled: null
};

export default (options) => {
  const cache = {};
  const resolveDeps = (depsArray, depsHash) => {
    const result = [];
    const resolve = (fields) => {
      if (!fields) return;

      fields.forEach((field) => {
        resolve(depsHash[field]);

        if (!cache[field]) {
          result.push(field);
          cache[field] = true;
        }
      });
    };

    resolve(depsArray);

    return result;
  };

  const optionsArray = Object.keys(options);
  const backwardAppendix = resolveDeps(optionsArray, backwardDeps);
  const forward = resolveDeps(backwardAppendix, forwardDeps);

  backwardAppendix.reverse();

  return [...forward, ...backwardAppendix];
};
