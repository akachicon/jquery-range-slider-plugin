import { warn } from '../dev/utils';

export const minMax = (
  { min: newMin, max: newMax },
  { min, max }
) => {
  const current = { min, max };
  const next = { min: newMin, max: newMax };
  const checker = { ...current, ...next };

  if (typeof checker.min !== 'number'
      || typeof checker.max !== 'number') {
    warn('Incorrect types for "min"/"max"!');

    return null;
  }

  if (checker.min > checker.max) {
    warn('"min" must be less than or equal to "max"!');

    return null;
  }

  return checker;
};

export const step = ({ step: st }) => {
  if (typeof st !== 'number' || st <= 0) {
    warn('"step" must be a positive number!');

    return null;
  }

  return { step: st };
};

export const orientation = ({ orientation: or }) => {
  if (or !== 'h' && or !== 'v') {
    warn('"orientation" must have a value of "h" or "v"!');

    return null;
  }

  return { orientation: or };
};

export const value = (
  { value: newVal, min, max }, // must already contain checked min/max
  { value: val },
  warnField = 'value'
) => {
  const current = { value: val };
  const next = { min, max, value: newVal };

  let checker;

  if (typeof next.value !== 'number') {
    if (value in next) {
      warn(`"${warnField}" must be a number!`);
    }

    checker = { ...next, ...current };
  } else {
    checker = { ...current, ...next };
  }

  if (checker.value < checker.min
      || checker.value > checker.max) {
    if (typeof next.value === 'number') {
      warn(`"${warnField}" must be in range [min, max]!`);

      checker.value = current.value;
    }

    if (checker.value > checker.max) {
      checker.value = checker.max;
    }

    if (checker.value < checker.min) {
      checker.value = checker.min;
    }
  }

  return { value: checker.value };
};

export const values = (
  { values: newVals, min, max }, // must already contain checked min/max
  { values: vals }
) => {
  let next = newVals;

  if (newVals instanceof Array === false) {
    warn('"values" must be an array!');

    next = new Array(2);
  }

  return {
    values: [0, 1].map(i => (
      value(
        { value: next[i], min, max },
        { value: vals[i] },
        `values[${i}]`
      ).value
    ))
  };
};

export const marks = (
  { marks: newMks, min, max }, // must already contain checked min/max
  { marks: mks }
) => {
  const filterMarks = (mksHash) => {
    const filteredMks = {};

    Object.keys(mksHash).forEach((position) => {
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(parseFloat(position))
        || position > max
        || position < min) {
        return;
      }
      filteredMks[position] = mksHash[position];
    });

    return filteredMks;
  };

  if (newMks instanceof Object === false) {
    warn('"marks" must be an object!');

    return { marks: filterMarks(mks) };
  }

  return { marks: filterMarks(newMks) };
};
