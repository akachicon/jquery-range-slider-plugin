// These functions never change any existing data,
// but may pass it to their results

/* eslint-disable no-shadow */

const minMax = (
  { min: newMin, max: newMax },
  { min, max }
) => {
  const current = { min, max };
  const next = {};

  if (typeof newMin === 'number') {
    next.min = newMin;
  }
  if (typeof newMax === 'number') {
    next.max = newMax;
  }

  if (!next.min && !next.max) {
    return null;
  }

  const checker = { ...current, ...next };

  if (checker.min > checker.max) {
    return null;
  }

  return checker;
};

export const min = (next, current) => {
  const res = minMax(next, current);

  if (!res) return null;

  return res.min;
};

export const max = (next, current) => {
  const res = minMax(next, current);

  if (!res) return null;

  return res.max;
};

export const step = ({ step }) => {
  if (typeof step !== 'number' || step <= 0) {
    return null;
  }

  return step;
};

export const orientation = ({ orientation }) => {
  if (orientation !== 'h' && orientation !== 'v') {
    return null;
  }

  return orientation;
};

export const value = (
  { value: newVal, min, max },
  { value: val }
) => {
  let checker = val;

  if (typeof newVal === 'number') {
    checker = newVal;
  }
  if (checker > max) {
    checker = max;
  }
  if (checker < min) {
    checker = min;
  }

  return checker;
};

export const values = (
  { values: newVals, min, max },
  { values: vals }
) => {
  let next = newVals;

  if (newVals instanceof Array === false) {
    next = new Array(2);
  }

  return [0, 1].map(i => (
    value(
      { value: next[i], min, max },
      { value: vals[i] }
    )
  ));
};

export const marks = ( // TODO: consider returning object deep copy
  { marks: newMks, min, max },
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
    return filterMarks(mks);
  }

  return filterMarks(newMks);
};
