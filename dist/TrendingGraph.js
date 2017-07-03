'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d = require('d3');

var d3 = _interopRequireWildcard(_d);

var _lodash = require('lodash');

var _SvgLoadingAnimation = require('./utils/SvgLoadingAnimation');

var _SvgLoadingAnimation2 = _interopRequireDefault(_SvgLoadingAnimation);

require('./style/TrendingGraph.scss');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var hourParseTime = d3.timeParse("%Y-%m-%d %H");
var dayParseTime = d3.timeParse("%Y-%m-%d");

var TRIM_LENGTH = 2;

var TrendingGraph = function (_React$Component) {
  _inherits(TrendingGraph, _React$Component);

  function TrendingGraph() {
    _classCallCheck(this, TrendingGraph);

    return _possibleConstructorReturn(this, (TrendingGraph.__proto__ || Object.getPrototypeOf(TrendingGraph)).apply(this, arguments));
  }

  _createClass(TrendingGraph, [{
    key: 'render',
    value: function render() {
      var width = this.props.width;
      var height = this.props.height;
      var path = void 0;

      if (this.props.isLoading) {
        path = _react2.default.createElement(_SvgLoadingAnimation2.default, { width: width, height: height });
      } else if (this.props.data) {
        var data = (0, _lodash.sortBy)((0, _lodash.filter)((0, _lodash.toPairs)((0, _lodash.mapValues)(this.props.data, 'c')), function (val) {
          return !(0, _lodash.isUndefined)(val) && val.length === 2;
        }), 0).slice(TRIM_LENGTH, -TRIM_LENGTH);

        var maxValue = ((0, _lodash.maxBy)(data, function (e) {
          return e[1];
        }) || [])[1];

        var parseTime = function parseTime(dt) {
          return hourParseTime(dt) || dayParseTime(dt);
        };

        var xAxis = d3.scaleTime().rangeRound([0, width]).domain(d3.extent(data, function (d) {
          return parseTime(d[0]);
        }));

        var yAxis = d3.scaleLinear().rangeRound([height * 0.95, height * 0.05]).domain([0, maxValue]);

        var getLine = d3.line().x(function (d) {
          return xAxis(parseTime(d[0]));
        }).y(function (d) {
          return yAxis(d[1]);
        });

        var d = getLine(data);

        path = _react2.default.createElement('path', { d: d, fill: 'none',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          className: 'trending_graph__line' });
      }

      return _react2.default.createElement(
        'svg',
        { className: 'trending_graph', viewBox: '0 0 ' + width + ' ' + height, width: width, height: height },
        path
      );
    }
  }]);

  return TrendingGraph;
}(_react2.default.Component);

TrendingGraph.propTypes = {
  /**
   * Dictionary of dates and values
   */
  data: _react2.default.PropTypes.object,
  width: _react2.default.PropTypes.number,
  height: _react2.default.PropTypes.number,
  isLoading: _react2.default.PropTypes.bool
};
TrendingGraph.defaultProps = {
  width: 200,
  height: 50
};
exports.default = TrendingGraph;