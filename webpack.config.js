/* globals module */

const webpack = require( 'webpack' );
const path = require( 'path' );

const config = {
  entry: './app/boot.js',
  output: {
    path: path.resolve( __dirname, 'build' ),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    modules: [
      path.resolve( './app' ),
      'node_modules',
    ],
    extensions: [
      '.js',
      '.jsx'
    ]
  },
  devServer: {
    contentBase: './dist'
  }
};

module.exports = config;
