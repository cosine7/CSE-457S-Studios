const HtmlWebpackPlugin = require('html-webpack-plugin');
const { resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/**
 * @type { import('webpack').Configuration }
 */
module.exports = {
  entry: ['./scripts/coffeeShop.js', './scripts/coffeeHouseChains.js'],
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.csv$/i,
        type: 'asset/resource',
        generator: {
          filename: 'data/[hash:10][ext]',
        },
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new MiniCssExtractPlugin(),
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
