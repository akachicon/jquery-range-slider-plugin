import * as refiners from './refiners';
import resolveDeps from './resolve-dependencies';

const deepCopy = arg => arg; // TODO: deep copy

export default (incoming, current, copy) => {
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

  if (copy) {
    return deepCopy({ ...current, ...refined });
  }

  return { ...current, ...refined };
};
