const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  plugin: HtmlWebpackPlugin,
  options: {
    template: path.resolve(__dirname, './index.html'),
    filename: 'index.html',
  },
};
