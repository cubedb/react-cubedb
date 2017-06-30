'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _BarGraph = require('./BarGraph');

var _BarGraph2 = _interopRequireDefault(_BarGraph);

var _reactBootstrap = require('react-bootstrap');

var _normalizeData = require('./utils/normalizeData');

var _normalizeData2 = _interopRequireDefault(_normalizeData);

require('./style/BarGraphGroup.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import { logAction } from '../../core/analytics'


var DIMENSION_LIMIT = 300;

var BarGraphColumn = function (_React$Component) {
  _inherits(BarGraphColumn, _React$Component);

  function BarGraphColumn(props) {
    _classCallCheck(this, BarGraphColumn);

    var _this = _possibleConstructorReturn(this, (BarGraphColumn.__proto__ || Object.getPrototypeOf(BarGraphColumn)).call(this, props));

    _this.onStretch = function (serie) {
      return function () {
        // logAction("graphs", "bar stretch", serie)
        _this.setState({
          stretched: Object.assign({}, _this.state.stretched, _defineProperty({}, _this.props.name + serie, !_this.state.stretched[_this.props.name + serie]))
        });
      };
    };

    _this.onSearch = function (serie) {
      return function (e) {
        var search = e.target.value;
        // logAction("graphs", "bar search", search)
        if (search.length) {
          try {
            new RegExp(search, 'i');
            _this.setState({
              search: Object.assign({}, _this.state.search, _defineProperty({}, serie, search))
            });
          } catch (e) {
            _this.setState({
              search: Object.assign({}, _this.state.search, _defineProperty({}, serie, false))
            });
          }
        } else {
          _this.setState({
            search: Object.assign({}, _this.state.search, _defineProperty({}, serie, undefined))
          });
        }
      };
    };

    _this.state = {
      stretched: [],
      search: []
    };
    return _this;
  }

  _createClass(BarGraphColumn, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'div',
        { className: 'cube_graph__column' },
        _lodash2.default.map(this.props.data, function (serie, key) {
          return _react2.default.createElement(
            'div',
            { key: key, className: 'bar-graph-group__list' },
            _react2.default.createElement(_BarGraph2.default, {
              name: key,
              data: serie,
              comparingTo: _this2.props.comparingTo && _this2.props.comparingTo[key],
              selected: _this2.props.selectedItems && _this2.props.selectedItems[key],
              onChange: _this2.props.onChange,
              slice: _this2.props.slice,
              group: _this2.props.group,
              lookup: _this2.props.lookup,
              getColor: _this2.props.getColor
            })
          );
        })
      );
    }
  }]);

  return BarGraphColumn;
}(_react2.default.Component);

var BarGraphGroup = function (_React$Component2) {
  _inherits(BarGraphGroup, _React$Component2);

  function BarGraphGroup() {
    var _ref;

    var _temp, _this3, _ret;

    _classCallCheck(this, BarGraphGroup);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this3 = _possibleConstructorReturn(this, (_ref = BarGraphGroup.__proto__ || Object.getPrototypeOf(BarGraphGroup)).call.apply(_ref, [this].concat(args))), _this3), _this3.getColumns = function () {
      return _this3.props.columns || Math.floor(_this3.props.width / 420);
    }, _temp), _possibleConstructorReturn(_this3, _ret);
  }

  _createClass(BarGraphGroup, [{
    key: 'render',
    value: function render() {
      var _this4 = this;

      var n = 0;
      var content = (0, _lodash2.default)(this.props.data).toPairs().sortBy(function (p) {
        var index = _this4.props.fieldOrders.indexOf(p[0]);
        if (index < 0) return 99999;else return index;
      }).groupBy(function (p) {
        return n++ % _this4.getColumns();
      }).map(function (g, i) {
        var key = _lodash2.default.reduce(g, function (k, e) {
          return k + e[0];
        });
        return _react2.default.createElement(BarGraphColumn, { key: key,
          data: _lodash2.default.fromPairs(g),
          allData: _this4.props.data,
          comparingTo: _this4.props.comparingTo,
          lookup: _this4.props.lookup,
          group: _this4.props.group,
          onChange: _this4.props.onChange,
          slice: _this4.props.slice,
          selectedItems: _this4.props.selectedItems,
          getColor: _this4.props.getColor });
      }).value();

      return _react2.default.createElement(
        'div',
        { className: 'bar-graph-group' },
        content
      );
    }
  }]);

  return BarGraphGroup;
}(_react2.default.Component);

BarGraphGroup.propTypes = {
  slice: _react2.default.PropTypes.number,
  width: _react2.default.PropTypes.number,
  columns: _react2.default.PropTypes.number,
  onChange: _react2.default.PropTypes.func,
  data: _react2.default.PropTypes.object,
  fieldOrders: _react2.default.PropTypes.array,
  getColor: _react2.default.PropTypes.func,
  group: _react2.default.PropTypes.string,
  lookup: _react2.default.PropTypes.object,
  selectedItems: _react2.default.PropTypes.object,
  comparingTo: _react2.default.PropTypes.object
};
BarGraphGroup.defaultProps = {
  onChange: undefined,
  data: {},
  fieldOrders: [],
  getColor: undefined,
  group: null,
  lookup: {},
  selectedItems: {},
  width: 420,
  comparingTo: null,
  columns: null
};
exports.default = BarGraphGroup;