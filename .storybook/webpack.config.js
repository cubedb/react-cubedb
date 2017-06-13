var path = require('path');

module.exports = {
  plugins: [
  ],
  module: {
    loaders: [{
      test: /\.js?/,
      include: path.resolve(__dirname, '../'),
      loader: 'babel-loader'
    },{
      test: /\.scss$/,
      include: path.resolve(__dirname, '../'),
      loaders: ['style-loader', 'css-loader', 'sass-loader']
    }]
  }
};
