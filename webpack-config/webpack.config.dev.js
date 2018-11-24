const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const project = require('../project.config');
const baseConfig = require('./webpack.config.base');
const { inProjectSrc } = require('../utils');

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'cheap-eval-source-map',
  output: {
    filename: 'dev-env.js',
  },
  devServer: {
    port: project.dev.port,
    host: project.dev.host,
    contentBase: path.resolve(project.basePath, project.outDir),
    clientLogLevel: project.dev.logLevel,
    hot: true
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      template: inProjectSrc(project.html.template),
      mobile: true,
      title: project.html.title
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
});
