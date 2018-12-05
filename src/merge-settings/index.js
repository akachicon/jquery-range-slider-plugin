import deepCopy from 'deep-copy';
import * as refiners from './refiners';
import resolveDeps from './resolve-dependencies';

// TODO: consider turning into a Model static method

export default (incoming, current, clone) => {
  if (typeof incoming !== 'object'
      || typeof current !== 'object') {
    return undefined;
  }

  const incomingKeys = resolveDeps(incoming);
  const refined = incomingKeys.reduce(
    (refinedIncoming, refinerKey) => {
      const newPropValue = refiners[refinerKey](incoming, current);

      if (newPropValue === null) {
        return refinedIncoming;
      }

      // eslint-disable-next-line no-param-reassign
      refinedIncoming[refinerKey] = newPropValue;

      return refinedIncoming;
    }, {}
  );

  if (clone) {
    return deepCopy({ ...current, ...refined });
  }

  return Object.assign(current, refined);
};
