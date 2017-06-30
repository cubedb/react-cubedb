'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _d = require('d3');

var d3 = _interopRequireWildcard(_d);

var _reactFauxDom = require('react-faux-dom');

var _reactFauxDom2 = _interopRequireDefault(_reactFauxDom);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _TimeGraphContent = require('./TimeGraphContent');

var _TimeGraphContent2 = _interopRequireDefault(_TimeGraphContent);

var _saveData = require('./utils/saveData');

var _saveData2 = _interopRequireDefault(_saveData);

require('./style/TimeGraph.scss');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NUM_DAYS = 100;

var xTickSize = {
  day: 85,
  hour: 105
};

var xTickInterval = {
  day: 7,
  hour: 12
};

var numberFormat = d3.format(",d");
var margin = { left: 80, right: 30, top: 50, bottom: 25 };
var STACK_LIMIT = 10;

var TimeGraph = function (_React$Component) {
  _inherits(TimeGraph, _React$Component);

  function TimeGraph(props) {
    _classCallCheck(this, TimeGraph);

    var _this = _possibleConstructorReturn(this, (TimeGraph.__proto__ || Object.getPrototypeOf(TimeGraph)).call(this, props));

    _this.updateDimensions = function () {
      var np = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.props;

      var el = _reactDom2.default.findDOMNode(_this);
      var containerWidth = el.parentElement ? el.parentElement.getBoundingClientRect().width : 600;

      if (containerWidth) {
        _this.setState({
          width: np.width ? np.width : containerWidth,
          height: np.height ? np.height : Math.max(containerWidth * 0.2, 260)
        });
      }
    };

    _this.onDownload = function (fromDate, toDate, volume, dataSerie) {
      return function () {
        var dataLabel = _this.props.timeFormatter(fromDate) + '_to_' + _this.props.timeFormatter(toDate);
        var defaultDimension = { c: 0 };
        var stacksLabel = '';
        var delimiter = ',';
        var endLine = '\r\n';

        var keys = {};

        (0, _lodash2.default)(dataSerie).map(1).map('stack').each(function (d) {
          _lodash2.default.each(d, function (n, k) {
            keys[k] = n.name;
          });
        });

        var createLine = function createLine(name) {
          var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
          var stack = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

          var proportion = volume > 0 && count > 0 ? (count || 0) / volume : 0;
          var stacks = '';

          if (_this.props.group) {
            _lodash2.default.each(keys, function (d, i) {
              stacks += '' + delimiter + (stack[i] || defaultDimension).c;
            });
          }

          stacks += '' + delimiter + count;

          return '' + name + stacks + endLine;
        };

        var body = (0, _lodash2.default)(dataSerie).sortBy(0).map(function (d) {
          return createLine(d[0], d[1].c, d[1].stack);
        }).join("");

        if (_this.props.group) {
          _lodash2.default.each(keys, function (d, i) {
            stacksLabel += '' + delimiter + d;
          });
        }

        stacksLabel += delimiter + 'total';

        var header = 'Date' + stacksLabel + endLine;
        var fileData = header + body;

        var file = new Blob([fileData], { type: 'text/plain' });

        (0, _saveData2.default)('timeseries_' + dataLabel + (_this.props.group ? '_grouped_by_' + _this.props.group : '') + '.csv', file);
      };
    };

    _this.toggleMetadata = function (type) {
      return function () {
        _this.setState({
          metadataFilter: Object.assign({}, _this.state.metadataFilter, _defineProperty({}, type, !_this.state.metadataFilter[type]))
        });
      };
    };

    _this.setP = _this.setP.bind(_this);

    _this.state = {
      width: 600,
      height: 260,
      comparing: false,
      metadataFilter: {
        release: false,
        experiment: false
      }
    };
    return _this;
  }

  _createClass(TimeGraph, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.updateDimensions();
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      window.addEventListener('resize', this.updateDimensions, false);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('resize', this.updateDimensions);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(np) {
      this.updateDimensions(np);
    }
  }, {
    key: 'lookup',
    value: function lookup(p) {
      var defaultLookup = function defaultLookup(key) {
        return key === 'null' ? '<not defined>' : key;
      };
      if (this.props.lookups && this.props.lookups[p]) {
        var lookup = this.props.lookups[p];
        return function (key) {
          return lookup[key] || defaultLookup(key);
        };
      } else return defaultLookup;
    }
  }, {
    key: 'drawAxis',
    value: function drawAxis(width, height, data, margin, fromDate, toDate, timeUnitLengthSec, xFormatter) {
      var yFormatter = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : numberFormat;
      var numUnits = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : NUM_DAYS;

      var dateRange = [fromDate, toDate];

      var maxValue = (0, _lodash2.default)(data).map('1').map('c').max();

      if (this.props.group) {
        var dimensionCount = {};

        _lodash2.default.each(data, function (d, i) {
          _lodash2.default.each(d[1].stack, function (b, k) {
            dimensionCount[k] = {
              key: k,
              c: dimensionCount[k] ? dimensionCount[k].c + b.c : b.c
            };
          });
        });

        var stacks = (0, _lodash2.default)(dimensionCount).sortBy('c').reverse().slice(0, STACK_LIMIT).map('key').value();

        if (this.props.type == 'line') {
          maxValue = (0, _lodash2.default)(data).map('1').map(function (d, k) {
            var stacksC = (0, _lodash2.default)(d.stack).mapValues('c').value();

            var stacksValue = (0, _lodash2.default)(stacksC).filter(function (d, k) {
              return stacks.indexOf(k) > -1;
            }).value();

            var otherSum = (0, _lodash2.default)(stacksC).filter(function (d, k) {
              return stacks.indexOf(k) < 0;
            }).sum();

            return (0, _lodash2.default)(stacksValue).concat(otherSum).max();
          }).max();
        }
      }

      var valueRange = [0, 1.1 * maxValue];

      var maxTicks = Math.max(2, Math.floor((width - margin.left - margin.right) / xTickSize[this.props.aggregation]) - 4);

      var x = d3.scaleTime().domain(dateRange).range([margin.left, width - margin.right]);

      var y = d3.scaleLinear().domain(valueRange).rangeRound([height - margin.bottom, margin.top]);

      var xAxis = d3.axisBottom(x).tickFormat(xFormatter).ticks(maxTicks);

      var yAxis = d3.axisLeft(y).tickFormat(yFormatter).ticks(5).tickSize(-width + margin.right + margin.left);

      var lineFunc = d3.line().x(function (d) {
        return x(d[0]);
      }).y(function (d) {
        return y(d[1]);
      }).curve(d3.curveStep);

      var boxWidth = x(new Date(timeUnitLengthSec * 1000)) - x(new Date(0));
      return { lineFunc: lineFunc, boxWidth: boxWidth, scale: { x: x, y: y }, axis: { x: xAxis, y: yAxis } };
    }
  }, {
    key: 'preProcess',
    value: function preProcess(data, timeParser, timeBounds) {
      var _this2 = this;

      return (0, _lodash2.default)(this.props.data).toPairs().map(function (p) {
        if (p[1].hasOwnProperty('c')) {
          return [timeParser(p[0]), p[1]];
        } else {
          var c = 0;
          _lodash2.default.each(p[1], function (e, k) {
            c += e.c;
            e.name = _this2.lookup(_this2.props.group)(k);
          });
          var dimension = {
            c: c,
            stack: p[1]
          };
          return [timeParser(p[0]), dimension];
        }
      }).filter(function (p) {
        return p[0] > timeBounds[0];
      }).value();
    }
  }, {
    key: 'setP',
    value: function setP(range) {
      var p = Array.sort(range.map(this.props.timeFormatter));
      this.props.onChange(p);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var toDate = this.props.toDate || new Date();
      var fromDate = this.props.fromDate || new Date(toDate.getTime() - NUM_DAYS * this.props.timeUnitLengthSec * 1000);

      var numUnit = Math.ceil((toDate - fromDate) / (this.props.timeUnitLengthSec * 1000));

      var data = this.preProcess(this.props.data, this.props.timeParser, [fromDate, toDate]);
      var graph = this.drawAxis(this.state.width, this.state.height, data, margin, fromDate, toDate, this.props.timeUnitLengthSec, this.props.timeDisplay, this.props.countFormatter, numUnit);
      var xAxis = new _reactFauxDom2.default.Element('g');

      d3.select(xAxis).attr("class", "xaxis").attr("transform", 'translate(0, ' + (this.state.height - margin.bottom) + ')').call(graph.axis.x);

      var yAxis = new _reactFauxDom2.default.Element('g');
      d3.select(yAxis).attr("class", "yaxis").attr("transform", 'translate(' + margin.left + ',0)').call(graph.axis.y);

      var range = void 0;
      if (this.props.filter) {
        range = _lodash2.default.chain(this.props.filter).map(this.props.timeParser).value();
      }

      var metadata = {};
      if (this.props.metadata) {
        _lodash2.default.each(this.props.metadata, function (_ref, mk) {
          var date = _ref.date,
              data = _ref.data;

          var hasData = false;
          var filteredData = {};
          _lodash2.default.each(data, function (d, k) {
            if (_this3.state.metadataFilter[d.type]) {
              hasData = true;
              filteredData[k] = d;
            }
          });
          if (hasData) {
            metadata[mk] = {
              date: date,
              data: filteredData
            };
          }
        });
      }

      return _react2.default.createElement(
        'svg',
        { className: 'time_graph', width: this.state.width, height: this.state.height },
        _react2.default.createElement(
          'g',
          { className: 'axis' },
          _react2.default.createElement(
            'g',
            null,
            xAxis.toReact()
          ),
          _react2.default.createElement(
            'g',
            null,
            yAxis.toReact()
          )
        ),
        _react2.default.createElement(
          'g',
          { onClick: this.onDownload(fromDate, toDate, this.maxValue, data) },
          _react2.default.createElement('rect', { className: 'time_graph__download-button', width: 20, height: 20, transform: 'translate(' + (this.state.width - margin.right - 20) + ', 3)' }),
          _react2.default.createElement('path', { className: 'time_graph__download-button__icon', transform: 'matrix(.5 0 0 .5 ' + (this.state.width - margin.right - 17) + ' 5)', d: 'M22.857 24q0-0.464-0.339-0.804t-0.804-0.339-0.804 0.339-0.339 0.804 0.339 0.804 0.804 0.339 0.804-0.339 0.339-0.804zM27.429 24q0-0.464-0.339-0.804t-0.804-0.339-0.804 0.339-0.339 0.804 0.339 0.804 0.804 0.339 0.804-0.339 0.339-0.804zM29.714 20v5.714q0 0.714-0.5 1.214t-1.214 0.5h-26.286q-0.714 0-1.214-0.5t-0.5-1.214v-5.714q0-0.714 0.5-1.214t1.214-0.5h8.304l2.411 2.429q1.036 1 2.429 1t2.429-1l2.429-2.429h8.286q0.714 0 1.214 0.5t0.5 1.214zM23.911 9.839q0.304 0.732-0.25 1.25l-8 8q-0.321 0.339-0.804 0.339t-0.804-0.339l-8-8q-0.554-0.518-0.25-1.25 0.304-0.696 1.054-0.696h4.571v-8q0-0.464 0.339-0.804t0.804-0.339h4.571q0.464 0 0.804 0.339t0.339 0.804v8h4.571q0.75 0 1.054 0.696z', fill: '#000000' })
        ),
        this.props.hideMetadata ? null : _react2.default.createElement(
          'g',
          { onClick: this.toggleMetadata('release') },
          _react2.default.createElement('rect', { className: 'time_graph__metadata-button', width: 70, height: 14, transform: 'translate(' + (this.state.width - margin.right - 100) + ', 5)' }),
          _react2.default.createElement(
            'text',
            { className: 'time_graph__metadata-button__text', style: { textAnchor: "left" }, width: 60, height: 12, transform: 'translate(' + (this.state.width - margin.right - 94) + ', 15)' },
            this.state.metadataFilter.release ? 'Hide' : 'Show',
            ' Releases'
          )
        ),
        this.props.hideMetadata ? null : _react2.default.createElement(
          'g',
          { onClick: this.toggleMetadata('experiment') },
          _react2.default.createElement('rect', { className: 'time_graph__metadata-button', width: 80, height: 14, transform: 'translate(' + (this.state.width - margin.right - 190) + ', 5)' }),
          _react2.default.createElement(
            'text',
            { className: 'time_graph__metadata-button__text', style: { textAnchor: "left" }, width: 60, height: 12, transform: 'translate(' + (this.state.width - margin.right - 184) + ', 15)' },
            this.state.metadataFilter.experiment ? 'Hide' : 'Show',
            ' Experiments'
          )
        ),
        _react2.default.createElement(_TimeGraphContent2.default, { xScale: graph.scale.x,
          yScale: graph.scale.y,
          range: range,
          timeDisplay: this.props.timeDisplay,
          aggregation: this.props.aggregation,
          timeUnitLengthSec: this.props.timeUnitLengthSec,
          onChange: this.setP,
          onClickCompare: this.props.onClickCompare,
          comparing: this.props.comparing,
          numberFormat: this.props.countFormatter || numberFormat,
          margin: margin,
          boxWidth: graph.boxWidth,
          data: data,
          group: this.props.group,
          getColor: this.props.getColor,
          type: this.props.type,
          mouseIteractions: this.props.mouseIteractions,
          metadata: this.props.hideMetadata ? null : metadata })
      );
    }
  }]);

  return TimeGraph;
}(_react2.default.Component);

TimeGraph.propTypes = {
  height: _react2.default.PropTypes.number,
  width: _react2.default.PropTypes.number,
  data: _react2.default.PropTypes.object,
  hideMetadata: _react2.default.PropTypes.bool,
  metadata: _react2.default.PropTypes.object,
  timeParser: _react2.default.PropTypes.func,
  timeDisplay: _react2.default.PropTypes.func,
  timeFormatter: _react2.default.PropTypes.func,
  countFormatter: _react2.default.PropTypes.func,
  lookup: _react2.default.PropTypes.func,
  filter: _react2.default.PropTypes.array,
  comparing: _react2.default.PropTypes.bool,
  onClickCompare: _react2.default.PropTypes.any,
  onChange: _react2.default.PropTypes.func,
  timeUnitLengthSec: _react2.default.PropTypes.number,
  numUnits: _react2.default.PropTypes.number,
  group: _react2.default.PropTypes.string,
  type: _react2.default.PropTypes.string,
  getColor: _react2.default.PropTypes.func,
  aggregation: _react2.default.PropTypes.string,
  mouseIteractions: _react2.default.PropTypes.bool,
  toDate: _react2.default.PropTypes.any,
  fromDate: _react2.default.PropTypes.any
};
TimeGraph.defaultProps = {
  mouseIteractions: true
};
exports.default = TimeGraph;