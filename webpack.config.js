/* globals module */
const path = require( 'path' );

module.exports = {
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    root: [
      path.resolve( './app' )
    ]
  },
  entry: {
    app: './app/boot.js',
  },
  output: {
    path: './build',
    filename: 'bundle.js'
  }
};

