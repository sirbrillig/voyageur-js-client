/* globals module */
const path = require( 'path' );

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [ 'babel-loader' ],
      },
    ],
  },
  resolve: {
    modules: [
      path.resolve( './app' ),
      'node_modules',
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

