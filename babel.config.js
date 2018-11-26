module.exports = (api) => {
  /* eslint-disable */

  // const __DEV__ = api.env('development');
  // const __PROD__ = api.env('production');
  const __TEST__ = api.env('test');

  /* eslint-enable */

  api.cache.forever();

  const config = {
    plugins: [
      [
        '@babel/plugin-transform-runtime',
        {
          regenerator: false,
          useESModules: !__TEST__
        }
      ]
    ],
    presets: [
      [
        '@babel/preset-env',
        {
          modules: __TEST__ ? 'commonjs' : false,
          useBuiltIns: 'usage',
          debug: !__TEST__
          // forceAllTransforms: __PROD__  // in case of using UglifyJS
        }
      ]
    ]
  };

  return config;
};
