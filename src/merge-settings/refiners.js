import deepCopy from 'deep-copy';

// These functions must never change any existing data
// or return original objects (nested included).
// They return null if they want to use current state.

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
  {
    value: newVal,
    min,
    max,
    step
  },
  { value: val }
) => {
  let checker = val;
  const len = max - min;

  if (typeof newVal === 'number') {
    checker = newVal;
  }

  if (checker < min || step >= len) {
    return min;
  }
  if (checker > max) {
    return max - (len % step);
  }

  return min
    + step * Math.floor((checker - min) / step)
    + step * ((checker - min) % step >= step / 2);
};

export const values = (
  {
    values: newVals,
    min,
    max,
    step
  },
  { values: vals }
) => {
  let next = newVals;

  if (newVals instanceof Array === false) {
    next = new Array(2);
  }

  if (typeof next[0] === 'number'
      && typeof next[1] === 'number'
      && next[0] > next[1]) {
    next = [next[1], next[0]];
  }

  return [0, 1].map(i => (
    value(
      {
        value: next[i],
        min,
        max,
        step
      },
      { value: vals[i] }
    )
  ));
};

export const marks = (
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
    return deepCopy(filterMarks(mks));
  }

  return deepCopy(filterMarks(newMks));
};
