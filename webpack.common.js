const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  target: ['web', 'es5'],
  entry: {
    azlib: './src/azlib.ts',
    azlib_light: './src/azlib.light.ts',
  },
  // plugins: [
  //   new HtmlWebpackPlugin({
  //     title: 'Production',
  //   }),
  // ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    // clean: true,
    library: 'azlib',
    // libraryExport: '',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  module: {
    rules: [{
      test: /\.ts$/,
      use: 'ts-loader',
      exclude: /node_modules/
    }]
  },
  resolve: {
    extensions: [
      '.ts', '.js',
    ],
  },
};