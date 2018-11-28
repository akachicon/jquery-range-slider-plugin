const path = require('path');
const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
  /** The environment to use when building the project */
  env: NODE_ENV,
  /** The full path to the project's root directory */
  basePath: __dirname,
  /** The name of the directory containing the application source code */
  srcDir: 'src',
  /** The file name of the application's entry point */
  main: {
    development: path.join('dev', 'dev-env'),
    production: 'range-slider-plugin'
  },
  /** The file name of the application's bootstrap */
  bootstrap: 'bootstrap',
  /** The name of the directory in which to emit compiled assets */
  outDir: 'dist',
  /** The base path for all projects assets (relative to the website root) */
  publicPath: '/',
  /** A hash map of keys that the compiler should treat as external to the project */
  externals: {
    jquery: 'jQuery'
  },
  /** A hash map of variables and their values to expose globally */
  globals: {},
  /** An html related data (basically supposed for WebpackHtmlPlugin) */
  html: {
    title: 'jQuery slider',
    template: path.join('dev', 'index.html'), // relative to srcDir
    // templateParameters: {}
  },
  dev: {
    /** Dev-server host */
    host: 'localhost',
    /** Dev-server port */
    port: 8080,
    /** Client log level (using webpack-dev-server log levels) */
    logLevel: 'info'
  }
};
