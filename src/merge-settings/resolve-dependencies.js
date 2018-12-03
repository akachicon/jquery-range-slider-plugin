const forwardDeps = {
  min: null,
  max: null,
  step: null,
  range: null,
  hint: null,
  orientation: null,
  value: ['min', 'max'],
  values: ['min', 'max'],
  marks: ['min', 'max'],
  enabled: null
};

const backwardDeps = {
  min: ['value', 'values', 'marks'],
  max: ['value', 'values', 'marks'],
  step: null,
  range: null,
  hint: null,
  orientation: null,
  value: null,
  values: null,
  marks: null,
  enabled: null
};

// There should be dependency resolving function,
// but because of simple deps structure we don't use it

export default (options) => {
  let forward;

  const keys = Object.keys(options);
  const minMax = keys.some(key => forwardDeps[key]);

  if (minMax) {
    forward = [
      'min',
      'max',
      ...keys.filter(key => key !== 'min'
        && key !== 'max')
    ];
  } else {
    forward = keys;
  }

  const valueValuesMarks = forward.some(key => backwardDeps[key]);

  if (valueValuesMarks) {
    return [
      ...forward.filter(key => key !== 'value'
        && key !== 'values'
        && key !== 'marks'),
      'value',
      'values',
      'marks'
    ];
  }

  return forward;
};
