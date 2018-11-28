import { minMax, step, orientation } from './refiners';

const refiners = [
  minMax,
  step,
  orientation
];

export default (incomingDefaults, currentDefaults) => {
  let refinedIncomingDefaults = {};

  refiners.forEach((refine) => {
    const newProps = refine(incomingDefaults, currentDefaults);

    if (!newProps) return;

    refinedIncomingDefaults = {
      ...refinedIncomingDefaults,
      ...newProps
    };
  });

  return refinedIncomingDefaults;
};
