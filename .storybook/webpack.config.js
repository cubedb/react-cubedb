var path = require('path');

module.exports = {
  module: {
    rules: [{
      // test: /\.scss$/,
      test: /\.(sass|less|css)$/,
      include: path.resolve(__dirname, '../'),
      use: [{ loader: 'less-loader' },{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'sass-loader' }]
    }]
  }
};
