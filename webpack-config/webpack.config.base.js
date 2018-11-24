const CleanWebpackPlugin = require('clean-webpack-plugin');
const project = require('../project.config');
const { inProject, inProjectSrc } = require('../utils');

/* eslint-disable */
const __DEV__ = project.env === 'development';
const __PROD__ = project.env === 'production';

const postCssPlugins = __PROD__ ? [
  require('autoprefixer')({}),
  require('cssnano')()
] : [];
/* eslint-enable */

module.exports = {
  context: inProjectSrc(''),
  entry: {
    main: [
      inProjectSrc(project.main[project.env])
    ]
  },
  output: {
    path: inProject(project.outDir)
  },
  resolve: {
    extensions: ['*', '.js', '.css'] // TODO: add less | scss
  },
  module: {
    rules: [
      {
        // Cause babel helpers may contain features that need to to be polyfilled and
        // using of babel's env preset 'useBuiltIns: usage' option we must include
        // helpers to be processed by babel loader. If you have another vendor files
        // that depend on polyfill you must specify it in exclude function.

        test: /\.js$/,
        exclude: modulePath => (
          /node_modules/.test(modulePath)
          && !/node_modules[\\/]@babel[\\/]runtime/.test(modulePath)
        ),
        use: [
          {
            loader: 'babel-loader',
            options: {
              // cacheDirectory: __DEV__,
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              singleton: true,
              hmr: __DEV__
            }
          },
          {
            loader: 'css-loader',
            options: {
              localIdentName: `${project.main.production}--[hash:base64:10]`,
              importLoaders: 1,
              modules: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: postCssPlugins
            }
          }
        ]
      },
      {
        test: /\.(svg|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 8192
        }
      }
    ]
  },
  optimization: {
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: {
        default: false,
        vendors: false
      }
    },
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], { root: project.basePath }),
  ]
};
