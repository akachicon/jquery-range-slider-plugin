export const warn = (message) => {
  if (process.env.NODE_ENV === 'production') return;

  console.log(`jQuery.rangeSlider: ${message}`);
};
