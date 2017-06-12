var webpack = require('webpack');
var path = require('path');
var package = require('./package.json');

var BUILD_DIR = path.resolve(__dirname, 'dist');
var APP_DIR = path.resolve(__dirname, 'src');

var config = {
  entry: [
    APP_DIR + '/index.js',
  ],
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
  ],
  devtool: 'source-map',
  output: {
    path: BUILD_DIR,
    filename: 'index.js',
    library: package.name,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    loaders: [{
      test: /\.js?/,
      include: APP_DIR,
      loader: 'babel-loader'
    },{
      test: /\.scss$/,
      include: APP_DIR,
      loaders: ['style-loader', 'css-loader', 'sass-loader']
    }]
  }
};

module.exports = config;
