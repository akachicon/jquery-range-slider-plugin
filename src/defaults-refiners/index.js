import {
  minMax,
  step,
  orientation,
  value,
  values,
  marks
} from './refiners';

// Some checks should be performed on top of others, e. g.
// we cannot check value unless we have checked minMax
// thus, refiners are arranged in an array

const refiners = [
  minMax,
  step,
  orientation,
  value,
  values,
  marks
];

export default (incomingDefaults, currentDefaults) => (
  refiners.reduce((refinedIncomingDefaults, refine) => {
    const newProps = refine(incomingDefaults, currentDefaults);

    if (!newProps) {
      return refinedIncomingDefaults;
    }

    Object.assign(
      refinedIncomingDefaults, newProps
    );

    return refinedIncomingDefaults;
  }, {})
);
