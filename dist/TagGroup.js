'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _reactBootstrap = require('react-bootstrap');

require('./style/TagGroup.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TagGroup = function (_React$Component) {
  _inherits(TagGroup, _React$Component);

  function TagGroup() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, TagGroup);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = TagGroup.__proto__ || Object.getPrototypeOf(TagGroup)).call.apply(_ref, [this].concat(args))), _this), _this.onClick = function (dimension, value) {
      return function () {
        _this.props.onChange && _this.props.onChange(dimension, value);
      };
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(TagGroup, [{
    key: 'lookup',
    value: function lookup(k, d) {
      return this.props.lookup && this.props.lookup[k] && this.props.lookup[k][d] || d;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var filterEl = [];
      var _props = this.props,
          tags = _props.tags,
          aggregation = _props.aggregation,
          group = _props.group,
          getColor = _props.getColor,
          onChange = _props.onChange;


      _lodash2.default.map(tags, function (f, dimension) {
        _lodash2.default.map(f, function (value, i) {
          var text = null;
          var iconEl = null;

          if (getColor) {
            iconEl = _react2.default.createElement('span', { className: 'graph-tags__element__color', style: { backgroundColor: _this2.props.getColor(text, dimension) } });
          } else {
            iconEl = _react2.default.createElement(
              'span',
              { className: 'graph-tags__element__icon' },
              _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: 'filter' })
            );
          }

          if (_lodash2.default.isObject(value)) {
            if (value.text) text = value.text;
            if (value.icon) iconEl = _react2.default.createElement(
              'span',
              { className: 'graph-tags__element__icon' },
              value.icon
            );
          } else {
            text = value;
          }

          filterEl.push(_react2.default.createElement(
            'span',
            { className: 'graph-tags__element ' + (_lodash2.default.isUndefined(onChange) ? "" : "graph-tags__element--with-action"),
              key: 'filter-' + dimension + text + i,
              onClick: _this2.onClick(dimension, text) },
            iconEl,
            ' ',
            dimension,
            ': ',
            _this2.lookup(dimension, text)
          ));
        });
      });

      return _react2.default.createElement(
        'div',
        { className: 'graph-tags' },
        filterEl
      );
    }
  }]);

  return TagGroup;
}(_react2.default.Component);

TagGroup.propTypes = {
  lookup: _react2.default.PropTypes.object,
  onChange: _react2.default.PropTypes.func,
  getColor: _react2.default.PropTypes.func,
  tags: _react2.default.PropTypes.object
};
exports.default = TagGroup;