const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const path = require('path');

const HtmlWebpackPlugin = require('./plugins/HtmlWebpackPlugin');
const applyPlugins = require('../../../../config/webpack/utils/applyPlugins');
const rules = require('../../../../config/webpack/rules');

module.exports = {
  target: 'web',
  entry: {
    index: path.resolve(
      __dirname,
      '../../src/application-test/applicationTest.ts'
    ),
  },
  output: {
    filename: '[name].js',
  },
  module: {
    rules: Object.values(rules),
  },
  mode: 'development',
  devServer: {
    client: { logging: 'error' },
    compress: true,
    historyApiFallback: true,
    port: 7545,
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': ' *',
    },
  },
  devtool: 'source-map',
  plugins: applyPlugins({
    HtmlWebpackPlugin,
  }),
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    modules: ['node_modules', path.resolve(__dirname, '../../src')],
    plugins: [
      new TsconfigPathsPlugin({
        baseUrl: path.resolve(__dirname, '../../../../config/ts'),
        configFile: path.resolve(__dirname, '../../tsconfig.json'),
      }),
    ],
  },
};
