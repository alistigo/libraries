const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    host: './src/host',
    thirdPartyJsLoader: './src/thirdPartyJsLoader.ts',
    thirdPartyJs: './src/thirdPartyJs.tsx',
  },
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: '[name]-[chunkhash].js',
  },
  devtool: 'source-map',
  devServer: {
    client: { logging: 'error' },
    compress: true,
    historyApiFallback: true,
    port: 8888,
    // TODO we should find a better alternative
    // This suppress warning messages of webpack host check in the browser console
    allowedHosts: 'all',
  },
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        include: [
          path.resolve(__dirname, './src'),
          /\/node_modules\/(?:@alist)\//,
          /\/packages\//,
        ],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'head',
      minify: {
        collapseWhitespace: true,
      },
      excludeChunks: ['thirdPartyJs'],
    }),
    new ScriptExtHtmlWebpackPlugin({
      // inline: ['thirdPartyJsLoader']
    }),
    new CleanWebpackPlugin(),
  ],
};
