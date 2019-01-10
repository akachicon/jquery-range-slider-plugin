const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const MinifyJSPlugin = require('babel-minify-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const project = require('../project.config');
const baseConfig = require('./webpack.config.base');
const { inProject, inProjectSrc } = require('../utils');

module.exports = merge(baseConfig, {
  entry: {
    main: [
      inProjectSrc(project.main.development)
    ]
  },
  output: {
    path: inProject(''),
    filename: 'gh-pages.js'
  },
  mode: 'production',
  devtool: false,
  plugins: [
    new HtmlWebpackPlugin({
      template: inProjectSrc(project.html.template),
      mobile: true,
      title: project.html.title,
      minify: true,
      inlineSource: '.js$'
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new webpack.HashedModuleIdsPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: path.resolve(project.basePath, 'bundle-report-gh-pages.html')
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
