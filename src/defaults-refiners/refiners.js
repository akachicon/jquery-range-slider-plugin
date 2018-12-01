// These functions never change any existing data,
// but may pass it to their results

export const minMax = (
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

export const step = ({ step: st }) => {
  if (typeof st !== 'number' || st <= 0) {
    return null;
  }

  return { step: st };
};

export const orientation = ({ orientation: or }) => {
  if (or !== 'h' && or !== 'v') {
    return null;
  }

  return { orientation: or };
};

export const value = (
  { value: newVal, min, max }, // must already contain checked min/max
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

  return { value: checker };
};

export const values = (
  { values: newVals, min, max }, // must already contain checked min/max
  { values: vals }
) => {
  let next;

  if (newVals instanceof Array === false) {
    next = new Array(2);
  }

  return {
    values: [0, 1].map(i => (
      value(
        { value: next[i], min, max },
        { value: vals[i] }
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
    return { marks: filterMarks(mks) };
  }

  return { marks: filterMarks(newMks) };
};
