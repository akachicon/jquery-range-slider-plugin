import deepCopy from 'deep-copy';
import * as refiners from './refiners';
import resolveDeps from './resolve-dependencies';

// TODO: consider turning into the Model static method

export default (incoming, current, clone) => {
  if (typeof incoming !== 'object'
      || typeof current !== 'object') {
    return undefined;
  }

  const incomingKeys = resolveDeps(incoming);
  const refined = incomingKeys.reduce(
    (refinedIncoming, refinerKey) => {
      const newPropValue = refiners[refinerKey]({
        ...incoming,
        ...refinedIncoming
      }, current);

      if (newPropValue === null) {
        // eslint-disable-next-line no-param-reassign
        refinedIncoming[refinerKey] = current[refinerKey];

        return refinedIncoming;
      }

      // eslint-disable-next-line no-param-reassign
      refinedIncoming[refinerKey] = newPropValue;

      return refinedIncoming;
    }, {}
  );

  if (clone) {
    // TODO: clone only those props that are not present in the refined

    return deepCopy({ ...current, ...refined });
  }

  return Object.assign(current, refined);
};
