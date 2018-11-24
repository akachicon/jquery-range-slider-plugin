module.exports = (api) => {
  // const __DEV__ = api.env('development');
  // const __PROD__ = api.env('production');

  api.cache.forever();

  const config = {
    plugins: [
      [
        '@babel/plugin-transform-runtime',
        {
          regenerator: false,
          useESModules: true
        }
      ]
    ],
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          useBuiltIns: 'usage',
          debug:  true
          // forceAllTransforms: __PROD__  // in case of using UglifyJS
        }
      ]
    ]
  };

  return config;
};
