export const error = (message) => {
  if (process.env.NODE_ENV === 'production') return;

  throw new Error(`jQuery.rangeSlider: ${message}`);
};
