'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require('react-bootstrap');

var _d = require('d3');

var d3 = _interopRequireWildcard(_d);

var _saveData = require('./utils/saveData');

var _saveData2 = _interopRequireDefault(_saveData);

var _normalizeData = require('./utils/normalizeData');

var _normalizeData2 = _interopRequireDefault(_normalizeData);

require('./style/BarGraph.scss');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var numberFormat = d3.format(",d");

var getCommonPrefix = function getCommonPrefix(array) {
  // return empty string for arrays withe less then two elements
  if (!array || array.length <= 1) return ''; // Sorting an array and comparing the first and last elements
  var A = array.concat().sort(),
      a1 = A[0],
      a2 = A[A.length - 1],
      L = a1.length,
      i = 0;
  while (i < L && a1.charAt(i) === a2.charAt(i)) {
    i++;
  }var prefix = a1.substring(0, i);
  // Now checking if it contains number and ends with _
  if (prefix[prefix.length - 1] === '_' && !/\d/.test(prefix)) return prefix;else return '';
};

var Bar = function (_React$Component) {
  _inherits(Bar, _React$Component);

  function Bar() {
    _classCallCheck(this, Bar);

    return _possibleConstructorReturn(this, (Bar.__proto__ || Object.getPrototypeOf(Bar)).apply(this, arguments));
  }

  _createClass(Bar, [{
    key: 'render',


    // shouldComponentUpdate(){
    //   return true;
    // }

    value: function render() {
      var _this2 = this;

      var bars = [];
      var limit = 5;
      var _props$data = this.props.data,
          c = _props$data.c,
          name = _props$data.name,
          key = _props$data.key,
          stack = _props$data.stack;


      if (this.props.group) {
        var highlights = _lodash2.default.chain(stack).sortBy('c').reverse().slice(0, limit).map('key').value();
        var amount = c;
        _lodash2.default.mapValues(stack, function (bar, i) {
          if (highlights.includes(bar.key)) {
            amount -= bar.c;
            var proportion = _this2.props.max > 0 ? bar.c / _this2.props.max : 0;
            var width = proportion * 100 + '%';
            bars.push(_react2.default.createElement('div', { key: bar.key + _this2.props.group, title: bar.name + ': ' + numberFormat(bar.c) + ' (' + (bar.c / c * 100).toFixed(3) + '%)', className: 'bar-graph__bar', style: { width: width, backgroundColor: _this2.props.getColor(bar.key, _this2.props.group) } }));
          }
        });

        if (amount > 0) {
          var percentage = this.props.max > 0 ? amount / this.props.max * 100 : 0;
          var width = percentage + '%';
          bars.push(_react2.default.createElement('div', { title: 'others: ' + numberFormat(amount) + ', (' + (amount / c * 100).toFixed(3) + '%)', key: 'others' + this.props.group, className: 'bar-graph__bar', style: { width: width, backgroundColor: this.props.getColor('other') } }));
        }
      } else {
        var _percentage = this.props.max > 0 ? c / this.props.max * 100 : 0;
        var _width = _percentage + '%';
        bars.push(_react2.default.createElement('div', { title: name + ': ' + numberFormat(c), key: key, className: 'bar-graph__bar', style: { width: _width, backgroundColor: this.props.getColor(key) } }));
      }

      return _react2.default.createElement(
        'div',
        { className: 'bar-graph__bar-wrap' },
        bars,
        _react2.default.createElement(
          'span',
          { className: 'bar-graph__bar__percentage' },
          (this.props.proportion * 100).toFixed(3) + '%'
        )
      );
    }
  }]);

  return Bar;
}(_react2.default.Component);

Bar.propTypes = {
  data: _react2.default.PropTypes.object,
  max: _react2.default.PropTypes.number,
  group: _react2.default.PropTypes.string,
  getColor: _react2.default.PropTypes.func,
  name: _react2.default.PropTypes.string,
  proportion: _react2.default.PropTypes.number };

var BarLine = function (_React$Component2) {
  _inherits(BarLine, _React$Component2);

  function BarLine() {
    _classCallCheck(this, BarLine);

    return _possibleConstructorReturn(this, (BarLine.__proto__ || Object.getPrototypeOf(BarLine)).apply(this, arguments));
  }

  _createClass(BarLine, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      return true;
    }
  }, {
    key: 'getIcon',
    value: function getIcon(val1, val2) {
      var percentage = (Math.abs(1 - val1 / val2) * 100).toFixed(1);
      if (val1 > val2) {
        return _react2.default.createElement(
          'div',
          { className: 'bar-graph__variation__wrapper' },
          _react2.default.createElement(
            'span',
            { className: 'bar-graph__variation--up' },
            '▲',
            isFinite(percentage) ? _react2.default.createElement(
              'span',
              { className: 'variation__icon' },
              percentage + '% '
            ) : _react2.default.createElement(
              'span',
              { className: 'variation__icon--infinity' },
              '\u221E'
            )
          )
        );
      } else if (val2 > val1) {
        return _react2.default.createElement(
          'div',
          { className: 'bar-graph__variation__wrapper' },
          _react2.default.createElement(
            'span',
            { className: 'bar-graph__variation--down' },
            '▼',
            isFinite(percentage) ? _react2.default.createElement(
              'span',
              { className: 'variation__icon' },
              percentage + '% '
            ) : _react2.default.createElement(
              'span',
              { className: 'variation__icon--infinity' },
              '\u221E'
            )
          )
        );
      } else {
        return _react2.default.createElement(
          'div',
          { className: 'bar-graph__variation__wrapper' },
          _react2.default.createElement(
            'span',
            { className: 'bar-graph__variation' },
            '='
          )
        );
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      return _react2.default.createElement(
        'div',
        { className: 'bar-graph' + (this.props.selected ? ' selected' : ''), onClick: function onClick() {
            return _this4.props.onChange(_this4.props.name, _this4.props.data.key);
          } },
        this.props.comparingData ? this.getIcon(this.props.data.c, this.props.comparingData.c) : null,
        _react2.default.createElement(
          'div',
          { className: 'bar-graph__label__wrapper' },
          _react2.default.createElement(
            'div',
            { className: 'bar-graph__label' },
            this.props.label
          )
        ),
        this.props.comparingData ? _react2.default.createElement(
          'div',
          { className: 'bar-graph__value__wrapper' },
          _react2.default.createElement(
            'div',
            { className: 'bar-graph__value' },
            numberFormat(this.props.comparingData.c || 0)
          ),
          _react2.default.createElement(
            'div',
            { className: 'bar-graph__value' },
            numberFormat(this.props.data.c || 0)
          )
        ) : _react2.default.createElement(
          'div',
          { className: 'bar-graph__value__wrapper' },
          _react2.default.createElement(
            'div',
            { className: 'bar-graph__value' },
            numberFormat(this.props.data.c || 0)
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'bar-graph__bar-container__wrapper' },
          _react2.default.createElement(
            'div',
            { className: 'bar-graph__bar-container' },
            this.props.comparingData ? _react2.default.createElement(Bar, { key: 'comparing',
              container: this.props.container,
              data: this.props.comparingData,
              group: this.props.group,
              name: this.props.name,
              max: this.props.stretched ? this.props.comparingData.c : this.props.max,
              getColor: this.props.getColor,
              proportion: this.props.comparingTotal > 0 && this.props.comparingData.c > 0 ? (this.props.comparingData.c || 0) / this.props.comparingTotal : 0 }) : null,
            _react2.default.createElement(Bar, { container: this.props.container,
              data: this.props.data,
              group: this.props.group,
              name: this.props.name,
              max: this.props.stretched ? this.props.data.c : this.props.max,
              getColor: this.props.getColor,
              proportion: this.props.total > 0 && this.props.data.c > 0 ? (this.props.data.c || 0) / this.props.total : 0 })
          )
        )
      );
    }
  }]);

  return BarLine;
}(_react2.default.Component);

BarLine.propTypes = {
  onChange: _react2.default.PropTypes.func,
  container: _react2.default.PropTypes.any,
  data: _react2.default.PropTypes.object,
  getColor: _react2.default.PropTypes.func,
  group: _react2.default.PropTypes.string,
  label: _react2.default.PropTypes.string,
  max: _react2.default.PropTypes.number,
  selected: _react2.default.PropTypes.true,
  name: _react2.default.PropTypes.any,
  stretched: _react2.default.PropTypes.bool,
  total: _react2.default.PropTypes.number,
  comparingData: _react2.default.PropTypes.any,
  comparingTotal: _react2.default.PropTypes.number
};

var BarList = function (_React$Component3) {
  _inherits(BarList, _React$Component3);

  function BarList() {
    _classCallCheck(this, BarList);

    return _possibleConstructorReturn(this, (BarList.__proto__ || Object.getPrototypeOf(BarList)).apply(this, arguments));
  }

  _createClass(BarList, [{
    key: 'render',


    // shouldComponentUpdate(){
    //   return true;
    // }

    value: function render() {
      var _this6 = this;

      var _props$dimension = this.props.dimension,
          serie = _props$dimension.serie,
          max = _props$dimension.max,
          total = _props$dimension.total;

      if (!_lodash2.default.isEmpty(serie)) {
        var comparingMax = this.props.comparingTo ? this.props.comparingTo.max : 0;
        var prefix = this.props.hideCommonPrefix ? getCommonPrefix(_lodash2.default.map(this.props.data, function (d) {
          if (d.name !== '<not defined>') return d.name;
        })) : '';

        return _react2.default.createElement(
          'div',
          { className: 'cube_bars__list__content' },
          (0, _lodash2.default)(serie).sortBy('c').reverse().slice(0, this.props.slice || serie.length).map(function (d, i) {
            var comparingData = null;
            if (_this6.props.comparingTo && _this6.props.comparingTo.serie) {
              comparingData = _this6.props.comparingTo.serie[d.key] ? _this6.props.comparingTo.serie[d.key] : { c: 0 };
            }
            if (!_this6.props.filter || RegExp(_this6.props.filter, 'i').test(d.name)) {
              return _react2.default.createElement(BarLine, {
                key: d.key,
                name: _this6.props.name,
                label: prefix ? d.name.startsWith(prefix) ? d.name.substring(prefix.length) : d.name : d.name,
                total: total,
                comparingTotal: _this6.props.comparingTo ? _this6.props.comparingTo.total : null,
                max: Math.max(max, comparingMax),
                data: d,
                group: _this6.props.group,
                stretched: _this6.props.stretched,
                container: _this6,
                onChange: _this6.props.onChange,
                comparingData: comparingData,
                getColor: _this6.props.getColor,
                selected: _this6.props.selected.indexOf(d.key) >= 0 });
            }
          }).value()
        );
      } else {
        return _react2.default.createElement(
          'div',
          { className: 'cube_bars__list__content--empty' },
          'No dimension available'
        );
      }
    }
  }]);

  return BarList;
}(_react2.default.Component);

BarList.propTypes = {
  dimension: _react2.default.PropTypes.object,
  slice: _react2.default.PropTypes.number,
  hideCommonPrefix: _react2.default.PropTypes.bool,
  stretched: _react2.default.PropTypes.bool,
  filter: _react2.default.PropTypes.string,
  getColor: _react2.default.PropTypes.func,
  group: _react2.default.PropTypes.string,
  name: _react2.default.PropTypes.string,
  comparingTo: _react2.default.PropTypes.object,
  lookup: _react2.default.PropTypes.object,
  selected: _react2.default.PropTypes.object
};
BarList.defaultProps = {
  hideCommonPrefix: false,
  stretched: false,
  getColor: d3.scaleOrdinal(d3.schemeCategory20c) };

var BarGraphHeader = function (_React$Component4) {
  _inherits(BarGraphHeader, _React$Component4);

  function BarGraphHeader() {
    var _ref;

    var _temp, _this7, _ret;

    _classCallCheck(this, BarGraphHeader);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this7 = _possibleConstructorReturn(this, (_ref = BarGraphHeader.__proto__ || Object.getPrototypeOf(BarGraphHeader)).call.apply(_ref, [this].concat(args))), _this7), _this7.onDownload = function (dataLabel, volume, dataSerie, comparingTo) {
      return function () {
        // logAction("graphs", "bar", "download")
        var defaultDimension = { c: 0 };
        var stacksLabel = '';
        var delimiter = ',';
        var endLine = '\r\n';

        var createLine = function createLine(name) {
          var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
          var stack = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

          var proportion = volume > 0 && count > 0 ? (count || 0) / volume : 0;
          var stacks = '';

          if (_this7.props.group) {
            _lodash2.default.each(_this7.props.allData[_this7.props.group], function (d, i) {
              stacks += '' + delimiter + (stack[i] || defaultDimension).c;
            });
          }

          stacks += '' + delimiter + count;

          return '' + name + delimiter + (proportion * 100).toFixed(3) + '%' + stacks + endLine;
        };

        var body = _lodash2.default.map(dataSerie, function (el) {
          if (comparingTo) {
            var window = comparingTo[el.key] || { count: 0, stack: [] };
            return '' + createLine('' + el.name + delimiter + 'A', window.c, window.stack) + createLine('' + el.name + delimiter + 'B', el.c, el.stack);
          } else {
            return createLine(el.name, el.c, el.stack);
          }
        }).join("");

        if (_this7.props.group) {
          _lodash2.default.each(_this7.props.allData[_this7.props.group], function (d, i) {
            stacksLabel += '' + delimiter + d[i].name;
          });
        }

        stacksLabel += delimiter + 'event count';

        var header = '' + dataLabel + delimiter + (comparingTo ? 'window' + delimiter : '') + 'percentage' + stacksLabel + endLine;
        var fileData = header + body;

        var blob = new Blob([fileData], { type: 'text/plain' });

        (0, _saveData2.default)('event_' + _this7.props.name + '_serie_' + dataLabel + (_this7.props.group ? '_grouped_by_' + _this7.props.group : '') + '.csv', blob);
      };
    }, _this7.onClickAddAll = function (e) {
      e.preventDefault();
      _this7.props.onChange(_this7.props.name, _lodash2.default.difference(_this7.props.dimensions, _this7.props.selectedItems));
    }, _this7.onClickInvert = function (e) {
      e.preventDefault();
      _this7.props.onChange(_this7.props.name, _this7.props.dimensions);
    }, _this7.onClickRemoveAll = function (e) {
      e.preventDefault();
      _this7.props.onChange(_this7.props.name, _this7.props.selectedItems);
    }, _temp), _possibleConstructorReturn(_this7, _ret);
  }

  _createClass(BarGraphHeader, [{
    key: 'render',
    value: function render() {
      var _this8 = this;

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'h4',
          null,
          this.props.name,
          ' ',
          _react2.default.createElement(
            'small',
            null,
            '(',
            (this.props.slice && this.props.slice < this.props.size ? this.props.slice + ' of ' : '') + this.props.size,
            ')'
          )
        ),
        _react2.default.createElement(
          _reactBootstrap.ButtonGroup,
          { className: 'bar-graph-group__actions' },
          _react2.default.createElement(
            _reactBootstrap.Button,
            { title: 'Click to save as csv', onClick: this.onDownload(this.props.name, this.props.total, this.props.dimension, this.props.comparingTo) },
            _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: 'save' })
          ),
          _react2.default.createElement(
            _reactBootstrap.OverlayTrigger,
            { container: this, trigger: 'click', rootClose: true, placement: 'bottom', overlay: _react2.default.createElement(
                _reactBootstrap.Popover,
                { className: 'bar-graph-group__filter__dimension', id: 'popover-' + this.props.name, title: '' },
                _react2.default.createElement(
                  'div',
                  null,
                  _react2.default.createElement(
                    _reactBootstrap.ButtonGroup,
                    null,
                    _react2.default.createElement(
                      _reactBootstrap.Button,
                      { bsSize: 'small', bsStyle: 'primary', onClick: this.onClickAddAll },
                      'Add all'
                    ),
                    _react2.default.createElement(
                      _reactBootstrap.Button,
                      { bsSize: 'small', bsStyle: 'primary', onClick: this.onClickInvert, disabled: !_lodash2.default.size(this.props.selectedItems) },
                      'Invert selected'
                    ),
                    _react2.default.createElement(
                      _reactBootstrap.Button,
                      { bsSize: 'small', bsStyle: 'primary', onClick: this.onClickRemoveAll, disabled: !_lodash2.default.size(this.props.selectedItems) },
                      'Remove all'
                    )
                  )
                ),
                _react2.default.createElement('br', null),
                _react2.default.createElement(
                  'div',
                  null,
                  _react2.default.createElement(
                    _reactBootstrap.FormGroup,
                    { className: 'bar-graph-group__list__search',
                      bsSize: 'small',
                      validationState: this.props.filter === false ? 'error' : this.props.filter ? 'success' : null },
                    _react2.default.createElement(_reactBootstrap.FormControl, { defaultValue: this.props.filter ? this.props.filter : undefined, onChange: this.props.onSearch, placeholder: 'Looking for...', type: 'text' }),
                    _react2.default.createElement(
                      _reactBootstrap.FormControl.Feedback,
                      null,
                      _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: 'search' })
                    )
                  )
                ),
                _react2.default.createElement('br', null),
                _react2.default.createElement(
                  'div',
                  null,
                  _react2.default.createElement(
                    _reactBootstrap.ButtonToolbar,
                    null,
                    _lodash2.default.map(this.props.selectedItems, function (f) {
                      return _react2.default.createElement(
                        _reactBootstrap.Button,
                        { className: 'bar-graph-group__filter__dimension__button',
                          key: 'filter-' + f,
                          onClick: function onClick() {
                            _this8.props.onChange([_this8.props.name])(f);
                          },
                          bsSize: 'xsmall' },
                        f,
                        ' ',
                        _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: 'remove-sign' })
                      );
                    })
                  )
                )
              ) },
            _react2.default.createElement(
              _reactBootstrap.Button,
              { title: 'Click to change the applied filters', bsStyle: (this.props.selectedItems || this.props.filter || []).length ? 'info' : 'default' },
              _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: 'filter' })
            )
          ),
          this.props.onStretch ? _react2.default.createElement(
            _reactBootstrap.Button,
            { title: 'Click to change the view mode', bsStyle: this.props.stretched ? 'primary' : 'default', onClick: this.props.onStretch },
            _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: 'tasks' })
          ) : null,
          _react2.default.createElement(
            _reactBootstrap.Button,
            { title: 'Click to change the stacking based in this group',
              bsStyle: this.props.group === this.props.name ? 'primary' : 'default',
              onClick: function onClick() {
                _this8.props.onChange('group', _this8.props.name);
              } },
            _react2.default.createElement(_reactBootstrap.Glyphicon, { glyph: 'indent-left' })
          )
        )
      );
    }
  }]);

  return BarGraphHeader;
}(_react2.default.Component);

var BarGraph = function (_React$Component5) {
  _inherits(BarGraph, _React$Component5);

  function BarGraph() {
    var _ref2;

    var _temp2, _this9, _ret2;

    _classCallCheck(this, BarGraph);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _ret2 = (_temp2 = (_this9 = _possibleConstructorReturn(this, (_ref2 = BarGraph.__proto__ || Object.getPrototypeOf(BarGraph)).call.apply(_ref2, [this].concat(args))), _this9), _this9.state = {
      stretched: false,
      search: null
    }, _this9.onSearch = function (e) {
      var search = e.target.value;

      if (search.length) {
        try {
          new RegExp(search, 'i');
          _this9.setState({
            search: search
          });
        } catch (e) {
          _this9.setState({
            search: false
          });
        }
      } else {
        _this9.setState({
          search: null
        });
      }
    }, _this9.onStretch = function () {
      _this9.setState({
        stretched: !_this9.state.stretched
      });
    }, _this9.onChange = function (name, selected) {
      return _this9.props.onChange && _this9.props.onChange(name, selected);
    }, _temp2), _possibleConstructorReturn(_this9, _ret2);
  }

  _createClass(BarGraph, [{
    key: 'render',
    value: function render() {
      var dimension = (0, _normalizeData2.default)(this.props.data, this.props.lookup[this.props.name], this.props.lookup[this.props.group]);
      var comparing = this.props.comparingTo ? (0, _normalizeData2.default)(this.props.comparingTo, this.props.lookup[this.props.name], this.props.lookup[this.props.group]) : null;
      var filter = this.state.search;
      var isGroupSource = this.props.group && this.props.group === this.props.name;

      return _react2.default.createElement(
        _reactBootstrap.Panel,
        { bsStyle: isGroupSource ? 'info' : 'default',
          header: _react2.default.createElement(BarGraphHeader, {
            name: this.props.name,
            dimensionKeys: _lodash2.default.map(dimension.serie, 'key'),
            total: dimension.total,
            comparingTo: comparing && comparing.serie,
            dimension: dimension.serie,
            selectedItems: this.props.selected,
            onSearch: this.onSearch,
            filter: filter,
            size: _lodash2.default.size(dimension.serie),
            onStretch: !isGroupSource && this.onStretch,
            stretched: !isGroupSource && this.state.stretched,
            onChange: this.onChange,
            slice: this.props.slice,
            group: this.props.group })
        },
        filter ? _react2.default.createElement(
          'div',
          { className: 'bar-graph-group__search-help' },
          'Search result for "',
          filter,
          '"'
        ) : null,
        _react2.default.createElement(BarList, {
          name: this.props.name,
          dimension: dimension,
          filter: filter,
          comparingTo: comparing,
          group: this.props.group,
          stretched: this.state.stretched,
          lookup: this.props.lookup,
          selected: this.props.selected,
          onChange: this.onChange,
          slice: this.props.slice,
          getColor: this.props.getColor })
      );
    }
  }]);

  return BarGraph;
}(_react2.default.Component);

BarGraph.propTypes = {
  comparingTo: _react2.default.PropTypes.object,
  data: _react2.default.PropTypes.object,
  getColor: _react2.default.PropTypes.func,
  group: _react2.default.PropTypes.string,
  lookup: _react2.default.PropTypes.object,
  name: _react2.default.PropTypes.string.isRequired,
  onChange: _react2.default.PropTypes.func,
  selected: _react2.default.PropTypes.array
};
BarGraph.defaultProps = {
  name: '',
  group: null,
  selected: [],
  comparingTo: null,
  lookup: {}
};
exports.default = BarGraph;