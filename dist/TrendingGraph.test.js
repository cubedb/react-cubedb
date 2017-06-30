'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // eslint-disable-line no-unused-vars


var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

var _TrendingGraph = require('./TrendingGraph');

var _TrendingGraph2 = _interopRequireDefault(_TrendingGraph);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultProps = {
  data: {
    '2017-01-01 01': { c: 1 },
    '2017-01-01 02': { c: 2 },
    '2017-01-01 03': { c: 3 }
  }
};

describe('TrendingGraph', function () {

  it('default', function () {
    var component = (0, _enzyme.shallow)(_react2.default.createElement(_TrendingGraph2.default, defaultProps));

    expect(component).toMatchSnapshot();
  });

  it('no data', function () {
    var component = (0, _enzyme.shallow)(_react2.default.createElement(_TrendingGraph2.default, _extends({}, defaultProps, { data: undefined })));

    expect(component).toMatchSnapshot();
  });

  it('is loading', function () {
    var component = (0, _enzyme.shallow)(_react2.default.createElement(_TrendingGraph2.default, _extends({}, defaultProps, { isLoading: true })));

    expect(component).toMatchSnapshot();
  });
});