const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const MinifyJSPlugin = require('babel-minify-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const project = require('../project.config');
const baseConfig = require('./webpack.config.base');

module.exports = merge(baseConfig, {
  mode: 'production',
  devtool: false,
  externals: project.externals,
  output: {
    filename: 'index.js',
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: path.resolve(project.basePath, 'bundle-report.html')
    })
  ],
  optimization: {
    noEmitOnErrors: false,
    minimize: true,
    minimizer: [
      new MinifyJSPlugin(
        {
          mangle: { topLevel: true },
        }
      ),
    ]
  }
});
