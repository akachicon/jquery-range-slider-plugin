import { error } from '../dev/utils';

export const minMax = (
  { min: newMin, max: newMax },
  { min, max }
) => {
  const current = { min, max };
  const next = { min: newMin, max: newMax };
  const checker = { ...current, ...next };

  if (checker.min > checker.max) {
    error('defaults.min must be less than or equal to default.max!');

    return null;
  }

  if (typeof checker.min !== 'number'
    || typeof checker.max !== 'number') {
    error('Incorrect types for min/max!');

    return null;
  }

  return checker;
};

export const step = ({ st }) => {
  if (typeof st !== 'number' && st <= 0) {
    error('Step must be a positive number!');

    return null;
  }

  return { step: st };
};

export const orientation = ({ or }) => {
  if (or !== 'h' && or !== 'v') {
    error('Orientation must have a value of `h` or `v`!');

    return null;
  }

  return { orientation: or };
};
