const HtmlWebpackPlugin = require('html-webpack-plugin');
const { resolve } = require('path');

/**
 * @type { import('webpack').Configuration }
 */
module.exports = {
  entry: ['./scripts/map.js', './scripts/forceSimulation.js'],
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.json$/i,
        type: 'asset/resource',
        generator: {
          filename: 'data/[hash:10][ext]',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
  ],
  devServer: {
    host: 'localhost',
    port: '8080',
    open: true,
  },
  experiments: {
    topLevelAwait: true,
  },
  mode: 'production',
};
