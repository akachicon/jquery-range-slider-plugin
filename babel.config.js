module.exports = (api) => {
  // const __DEV__ = api.env('development');
  // const __PROD__ = api.env('production');
  const __TEST__ = api.env('test');

  api.cache.forever();

  const config = {
    plugins: [
      [
        '@babel/plugin-transform-runtime',
        {
          corejs: 2,
          regenerator: false, // this project currently does not use any async syntax or built-ins
          useESModules: !__TEST__
        }
      ]
    ],
    presets: [
      [
        '@babel/preset-env',
        {
          loose: true,
          modules: __TEST__ ? 'commonjs' : false,
          useBuiltIns: false,
          debug: !__TEST__
        }
      ]
    ]
  };

  return config;
};
