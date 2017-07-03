'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _d = require('d3');

var d3 = _interopRequireWildcard(_d);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var numberFormat = d3.format(",d");

var BAR_MARGIN = 1;
var STACK_LIMIT = 10;

var fromPath = "M-0.5,46.666666666666664A6,6 0 0 0 -6.5,52.666666666666664V87.33333333333333A6,6 0 0 0 -0.5,93.33333333333333ZM-2.5,54.666666666666664V85.33333333333333M-4.5,54.666666666666664V85.33333333333333";
var toPath = "M0.5,46.666666666666664A6,6 0 0 1 6.5,52.666666666666664V87.33333333333333A6,6 0 0 1 0.5,93.33333333333333ZM2.5,54.666666666666664V85.33333333333333M4.5,54.666666666666664V85.33333333333333";

var TimeGraphContent = function (_React$Component) {
  _inherits(TimeGraphContent, _React$Component);

  function TimeGraphContent(props) {
    _classCallCheck(this, TimeGraphContent);

    var _this = _possibleConstructorReturn(this, (TimeGraphContent.__proto__ || Object.getPrototypeOf(TimeGraphContent)).call(this, props));

    _this.onMouseEnterMetadata = function (k) {
      return function (e) {
        _this.setState({
          visibleMetadata: k
        });
      };
    };

    _this.onMouseLeaveMetadata = function (e) {
      _this.setState({
        visibleMetadata: null
      });
    };

    _this.getArea = function () {
      var baseY = _this.props.yScale.range()[0];
      var stacks = [];
      var series = {};

      var addSerie = function addSerie(serie, val) {
        if (!series[serie]) {
          series[serie] = Object.assign({}, defaultSerie);
        }
        series[serie][val.x] = val;
      };

      var valueArea = d3.area().x(function (d) {
        return d.x;
      }).y0(function (d) {
        return d.y0;
      }).y1(function (d) {
        return d.y1;
      });

      var defaultSerie = _lodash2.default.transform(_this.props.xScale.ticks((_this.props.aggregation == 'day' ? d3.timeDay : d3.timeHour).every(1)), function (obj, dt, i) {
        var x = _this.props.xScale(dt);
        obj[x] = {
          x: x,
          y0: baseY,
          y1: baseY
        };
        return obj;
      }, {});

      if (_this.props.group) {
        var dimensionCount = {};
        _lodash2.default.each(_this.props.data, function (d, i) {
          var x = _this.props.xScale(d[0]);
          var maxY = _this.props.yScale(d[1].c);
          defaultSerie[x] = {
            x: x,
            y0: maxY,
            y1: maxY
          };
          _lodash2.default.each(d[1].stack, function (b, k) {
            dimensionCount[k] = {
              key: k,
              c: dimensionCount[k] ? dimensionCount[k].c + b.c : b.c
            };
          });
        });

        stacks = (0, _lodash2.default)(dimensionCount).sortBy('c').reverse().slice(0, STACK_LIMIT).map('key').value();
      }

      _this.flattenData = [];
      (0, _lodash2.default)(_this.props.data).each(function (d, i) {
        var xPos = _this.props.xScale(d[0]);
        var x = xPos;
        var bars = [];

        _this.flattenData[xPos] = {
          c: d[1].c,
          stack: []
        };

        if (d[1].stack) {
          var amount = d[1].c;
          var currentY = _this.props.yScale(amount);

          (0, _lodash2.default)(stacks).each(function (k) {
            var e = d[1].stack[k];
            if (e) {
              _this.flattenData[xPos].stack.push({
                c: e.c,
                name: e.name,
                key: k
              });
              amount -= e.c;
            }
            var y1 = currentY;
            currentY = _this.props.yScale(amount);
            var y0 = currentY;
            addSerie(k, { x: x, y0: y0, y1: y1 });
          });

          var y1 = _this.props.yScale(amount);
          var y0 = baseY;
          addSerie('other', { x: x, y0: y0, y1: y1 });
          if (amount > 0) {
            _this.flattenData[xPos].stack.push({
              name: 'other',
              key: 'other',
              c: amount
            });
          }
        } else {
          var y = _this.props.yScale(d[1].c);
          addSerie(0, { x: x, y1: y, y0: baseY });
        }
      });

      var paths = _lodash2.default.map(series, function (serie, k) {
        var sortedSerie = _lodash2.default.sortBy(serie, 'x');
        var color = _this.props.getColor(k, _this.props.group);
        return _react2.default.createElement('path', { key: k, d: valueArea(sortedSerie), fill: color, stroke: color, className: 'area', title: k });
      });
      return paths;
    };

    _this.getLines = function () {
      var baseY = _this.props.yScale.range()[0];
      var stacks = [];
      var series = {};

      var defaultSerie = _lodash2.default.transform(_this.props.xScale.ticks((_this.props.aggregation == 'day' ? d3.timeDay : d3.timeHour).every(1)), function (obj, dt, i) {
        var x = _this.props.xScale(dt);
        obj[x] = {
          x: x,
          y: baseY
        };
        return obj;
      }, {});

      var addSerie = function addSerie(serie, val) {
        if (!series[serie]) {
          series[serie] = Object.assign({}, defaultSerie);
        }
        series[serie][val.x] = val;
      };

      if (_this.props.group) {
        var dimensionCount = {};
        _lodash2.default.each(_this.props.data, function (d, i) {
          _lodash2.default.each(d[1].stack, function (b, k) {
            dimensionCount[k] = {
              key: k,
              c: dimensionCount[k] ? dimensionCount[k].c + b.c : b.c
            };
          });
        });

        stacks = (0, _lodash2.default)(dimensionCount).sortBy('c').reverse().slice(0, STACK_LIMIT).map('key').value();
      }

      _this.flattenData = [];
      (0, _lodash2.default)(_this.props.data).each(function (d, i) {
        var xPos = _this.props.xScale(d[0]);
        var x = xPos;
        var bars = [];

        _this.flattenData[xPos] = {
          c: d[1].stack ? (0, _lodash2.default)(d[1].stack).map('c').max() : d[1].c,
          stack: []
        };

        if (d[1].stack) {
          var usedHeight = 0;
          var amount = d[1].c;
          (0, _lodash2.default)(stacks).each(function (k) {
            var e = d[1].stack[k];
            if (e) {
              _this.flattenData[xPos].stack.push({
                name: e.name,
                c: e.c,
                key: k
              });
              var y = _this.props.yScale(e.c);
              amount -= e.c;

              addSerie(k, { x: x, y: y });
            }
          });
          if (amount > 0) {
            var y = _this.props.yScale(amount);
            addSerie('other', { x: x, y: y });
            _this.flattenData[xPos].stack.push({
              name: 'other',
              key: 'other',
              c: amount
            });
          }
        } else {
          var _y = _this.props.yScale(d[1].c);
          addSerie(0, { x: x, y: _y });
        }
      });

      var valueLine = d3.line().x(function (d) {
        return d.x;
      }).y(function (d) {
        return d.y;
      });

      var paths = _lodash2.default.map(series, function (serie, k) {
        var sortedSerie = _lodash2.default.sortBy(serie, 'x');
        if (_this.props.group) {
          var maxValue = (0, _lodash2.default)(sortedSerie).sortBy('y').map('y').head();
          if (maxValue < baseY) {
            return _react2.default.createElement('path', { key: k, d: valueLine(sortedSerie), stroke: _this.props.getColor(k, _this.props.group), fill: 'none', className: 'line' });
          }
        } else {
          return _react2.default.createElement('path', { key: k, d: valueLine(sortedSerie), stroke: _this.props.getColor(k), fill: 'none', className: 'line' });
        }
      });
      return paths;
    };

    _this.getBars = function () {
      var stacks = [];
      if (_this.props.group) {
        var dimensionCount = {};
        _lodash2.default.each(_this.props.data, function (d, i) {
          _lodash2.default.each(d[1].stack, function (b, k) {
            dimensionCount[k] = {
              key: k,
              c: dimensionCount[k] ? dimensionCount[k].c + b.c : b.c
            };
          });
        });

        stacks = (0, _lodash2.default)(dimensionCount).sortBy('c').reverse().slice(0, STACK_LIMIT).map('key').value();
      }

      _this.flattenData = [];
      return (0, _lodash2.default)(_this.props.data).map(function (d, i) {
        var hovered = _this.props.mouseIteractions && _this.state.focused && !_this.state.mousePressed && _this.props.xScale(_this.roundDate(_this.props.xScale.invert(_this.state.mark.x))) == _this.props.xScale(_this.roundDate(d[0]));
        var x = _this.props.xScale(d[0]) + BAR_MARGIN;
        var range0 = _this.props.xScale(Math.min.apply(Math, _toConsumableArray(_this.state.range)));
        var range1 = _this.props.xScale(Math.max.apply(Math, _toConsumableArray(_this.state.range)));
        var totalHeight = _this.props.yScale.range()[0];
        var rangeDiff = Math.abs(range1 - range0);
        var width = _this.props.boxWidth > 2 * BAR_MARGIN ? _this.props.boxWidth - 2 * BAR_MARGIN : _this.props.boxWidth;
        var noActive = _this.state.overlayVisible && (_this.props.comparing ? x < range0 - rangeDiff || x >= range1 : x < range0 || x >= range1);
        var bars = [];

        _this.flattenData[_this.props.xScale(d[0])] = {
          c: d[1].c,
          stack: []
        };

        if (hovered) {
          bars.push(_react2.default.createElement('rect', { fill: 'url(#diagonalHatch)', key: i + "hover", x: x, y: _this.props.margin.top, width: width, height: totalHeight - _this.props.yScale(0), className: 'bar shadow' }));
        }

        if (d[1].stack) {
          var amount = d[1].c;
          var currentY = _this.props.yScale(amount);

          (0, _lodash2.default)(stacks).each(function (k) {
            var e = d[1].stack[k];
            if (e) {
              _this.flattenData[_this.props.xScale(d[0])].stack.push({
                name: e.name,
                c: e.c,
                key: k
              });
              var startY = _this.props.yScale(amount);
              amount -= e.c;
              currentY = _this.props.yScale(amount);
              var height = currentY - startY;

              bars.push(_react2.default.createElement('rect', { fill: _this.props.getColor(k, _this.props.group), key: i + k, x: x, title: e.name, y: startY, width: width, height: height, className: 'bar ' + (hovered ? "hovered" : noActive ? "no-active" : "") }));
            }
          });

          if (amount > 0) {
            var startY = _this.props.yScale(amount);
            var height = totalHeight - startY;

            _this.flattenData[_this.props.xScale(d[0])].stack.push({
              name: 'other',
              key: 'other',
              c: amount
            });

            bars.push(_react2.default.createElement('rect', { fill: _this.props.getColor('other'), key: i + 'other', x: x, y: startY, width: width, height: height, className: 'bar ' + (hovered ? "hovered" : noActive ? "no-active" : "") }));
          }
        } else {
          var _startY = _this.props.yScale(d[1].c);
          var _height = totalHeight - _startY;
          bars.push(_react2.default.createElement('rect', { key: i, fill: _this.props.getColor(i), x: x, y: _startY, width: width, height: _height, className: 'bar ' + (hovered ? "hovered" : noActive ? "no-active" : "") + ' ' + (_this.props.group ? "group" : "no-group") }));
        }

        return bars;
      }).value();
    };

    _this.types = {
      "bar": _this.getBars,
      "line": _this.getLines,
      "area": _this.getArea
    };


    var defaultMousePos = _this.props.range && _this.props.xScale(_this.props.range[0]) >= _this.props.xScale.range()[0] && _this.props.xScale(_this.props.range[1]) <= _this.props.xScale.range()[1] ? _this.props.xScale(_this.props.range[0]) : _this.props.xScale.range()[0];

    _this.state = {
      overlayVisible: !!_this.props.range,
      range: _this.props.range && _this.props.range[1] ? [_this.props.range[0], new Date(_this.props.range[1].getTime() + _this.props.timeUnitLengthSec * 999)] : [],
      mousePressed: false,
      focused: false,
      dragging: false,
      mark: { x: defaultMousePos, y: 0 },
      date: _this.roundDate(_this.props.xScale.invert(defaultMousePos)),
      visibleMetadata: null,
      clickPos: 0
    };

    _this.flattenData = [];

    _this.onMouseClick = _this.props.mouseIteractions ? _this.onMouseClick.bind(_this) : function () {};
    _this.onMouseMove = _this.props.mouseIteractions ? _this.onMouseMove.bind(_this) : function () {};
    _this.onMouseLeave = _this.props.mouseIteractions ? _this.onMouseLeave.bind(_this) : function () {};
    _this.onMouseEnter = _this.props.mouseIteractions ? _this.onMouseEnter.bind(_this) : function () {};
    _this.onMouseRelease = _this.props.mouseIteractions ? _this.onMouseRelease.bind(_this) : function () {};
    if (!_this.props.onClickCompare) {
      _this.allowComparing = false;
    } else {
      _this.allowComparing = true;
      _this.onClickCompare = _this.props.mouseIteractions ? _this.onClickCompare.bind(_this) : function () {};
    }
    _this.onChange = _this.props.mouseIteractions ? _lodash2.default.debounce(_this.onChange, 100) : function () {};
    return _this;
  }

  _createClass(TimeGraphContent, [{
    key: 'getTextWidth',
    value: function getTextWidth(text) {
      var fontSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 14;
      var fontFace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Arial';

      var a = document.createElement('canvas');
      var b = a.getContext('2d');
      b.font = fontSize + 'px ' + fontFace;
      return b.measureText(text).width;
    }
  }, {
    key: 'getXY',
    value: function getXY(e) {
      var rect = e.target.getBoundingClientRect();
      var xy = {
        x: e.clientX - rect.left + this.props.xScale.range()[0],
        y: e.clientY - rect.top + this.props.margin.top
      };
      return xy;
    }
  }, {
    key: 'roundDate',
    value: function roundDate(date, timeUnit) {
      var g = (timeUnit || this.props.timeUnitLengthSec) * 1000;
      var o = date.getTimezoneOffset() * -6e4;
      var x = Math.round((+date + o) / g);
      return new Date(x * g - o);
    }
  }, {
    key: 'onMouseEnter',
    value: function onMouseEnter(e) {
      e.preventDefault();
      this.setState({
        focused: true
      });
    }
  }, {
    key: 'onMouseLeave',
    value: function onMouseLeave(e) {
      if (this.state.mousePressed || this.state.dragging) {
        this.onMouseRelease(e);
      } else {
        e.preventDefault();
      }
      this.setState({
        focused: false
      });
    }
  }, {
    key: 'onMouseClick',
    value: function onMouseClick(e) {
      e.preventDefault();
      if (this.allowComparing) {
        var dragging = false;
        var range = this.state.range;
        var xy = this.getXY(e);
        var x = this.roundDate(this.props.xScale.invert(xy.x));

        if (this.state.overlayVisible && this.state.focused && range.length && x >= Math.min.apply(Math, _toConsumableArray(range)) && x <= Math.max.apply(Math, _toConsumableArray(range))) {
          dragging = true;
        } else {
          range = [x];
        }

        this.setState({
          mousePressed: true,
          range: range,
          clickPos: xy.x,
          dragging: dragging,
          overlayVisible: dragging || this.state.overlayVisible
        });
      }
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      e.preventDefault();
      var xy = this.getXY(e);
      var mark = xy;
      var date = this.roundDate(this.props.xScale.invert(mark.x));

      if (this.state.mousePressed) {
        this.setRange(mark.x, this.state.dragging);
      } else {
        this.setState({
          date: date,
          mark: mark
        });
      }
    }
  }, {
    key: 'setRange',
    value: function setRange(end, dragging, forcedStart) {
      var newRange = this.state.range;
      var firstPos = forcedStart || this.state.clickPos;
      var last = this.state.mark.x;

      if (dragging) {
        var diff = this.props.xScale.invert(end).getTime() - this.props.xScale.invert(firstPos).getTime();
        var rangeInterval = newRange[1].getTime() - newRange[0].getTime();
        var newStart = newRange[0].getTime() + diff - (this.props.xScale.invert(last).getTime() - this.props.xScale.invert(firstPos).getTime());
        var newEnd = newStart + rangeInterval;
        var startDate = this.roundDate(new Date(Math.min(newStart, newEnd)));
        var endDate = this.roundDate(new Date(Math.max(newStart, newEnd)));

        if (this.props.comparing) {
          if (new Date(startDate - rangeInterval) >= this.props.xScale.invert(this.props.xScale.range()[0]) && endDate <= this.props.xScale.invert(this.props.xScale.range()[1])) {
            newRange = [startDate, endDate];
          }
        } else {
          if (startDate >= this.props.xScale.invert(this.props.xScale.range()[0]) && endDate <= this.props.xScale.invert(this.props.xScale.range()[1])) {
            newRange = [startDate, endDate];
          }
        }
      } else {
        newRange[1] = this.roundDate(this.props.xScale.invert(end));
      }

      if (Math.abs(end - firstPos) > 10) {
        this.setState({
          mark: Object.assign({}, this.state.mark, {
            x: end
          }),
          range: newRange,
          overlayVisible: true
        });
        return newRange;
      }
    }
  }, {
    key: 'onMouseRelease',
    value: function onMouseRelease(e) {
      e.preventDefault();
      if (this.allowComparing) {
        var xy = this.getXY(e);
        var firstPos = this.state.clickPos;
        var overlayVisible = this.state.overlayVisible;
        var range = this.state.range;
        var dragging = this.state.dragging;

        this.setRange(xy.x, this.state.dragging);

        if (Math.abs(xy.x - firstPos) > 10) {
          this.onChange(range);
          dragging = false;
        } else if (!this.state.dragging && this.state.overlayVisible) {
          range = [];
          this.onChange(range);
          this.props.onClickCompare(false);
          overlayVisible = false;
          dragging = false;
        }

        this.setState({
          mousePressed: false,
          dragging: dragging,
          clickPos: xy.x,
          overlayVisible: overlayVisible,
          range: range
        });
      }
    }
  }, {
    key: 'onClickCompare',
    value: function onClickCompare() {
      if (this.allowComparing) {
        this.props.onClickCompare(!this.props.comparing);
      }
    }
  }, {
    key: 'onChange',
    value: function onChange(range) {
      this.props.onChange(range);
    }
  }, {
    key: 'getInterval',
    value: function getInterval() {
      var interval = this.props.aggregation == 'day' ? 7 : 24;

      return this.props.timeUnitLengthSec * interval;
    }
  }, {
    key: 'countRange',
    value: function countRange(range) {
      return parseInt(Math.abs(range[1] - range[0]) / this.props.timeUnitLengthSec / 1000);
    }
  }, {
    key: 'getYMark',
    value: function getYMark() {
      var _this2 = this;

      var x0 = this.props.xScale.range()[0];
      var x2 = this.props.xScale.range()[1];
      var y0 = this.props.yScale.range()[0];
      var y2 = this.props.yScale.range()[1];

      if (this.state.mark && this.state.focused && !this.state.mousePressed) {
        var xPoint = this.props.xScale(this.roundDate(this.props.xScale.invert(this.state.mark.x)));
        var topDistance = 80;

        if (this.flattenData[xPoint]) {
          var value = this.flattenData[xPoint].c;
          var posY = this.props.yScale(value);
          var labels = this.props.group ? (0, _lodash2.default)(this.flattenData[xPoint].stack).filter('c').map('name').value() : [""];
          var maxValue = ((0, _lodash2.default)(this.flattenData[xPoint].stack).sortBy(function (d, e) {
            return ('' + d.c).length;
          }).reverse().head() || this.flattenData[xPoint]).c;
          var rectHeight = this.props.group ? labels.length * 16 : 16;
          var longestLabel = (0, _lodash2.default)(labels).sortBy('length').value().pop() || "";
          var rectWidth = this.getTextWidth(longestLabel + ': ' + this.props.numberFormat(maxValue), 11) + 20;
          var rectPos = Math.min(Math.max(xPoint, x0), x2);

          if (x2 - xPoint < rectWidth) {
            rectPos = rectPos - rectWidth - this.props.margin.right;
          } else {
            rectPos = rectPos + this.props.margin.right;
          }
          var stackN = 0;

          return _react2.default.createElement(
            'g',
            { key: 'y-ruler' },
            _react2.default.createElement('line', { className: 'ruler__mark', strokeDasharray: '6, 2', y1: posY || 0, y2: posY || 0, x2: x2, x1: x0 }),
            _react2.default.createElement('rect', { className: 'tooltip__background', rx: '4', ry: '4', transform: 'translate(' + rectPos + ', ' + (topDistance - 22) + ')', width: rectWidth, height: rectHeight }),
            this.props.group ? (0, _lodash2.default)(this.flattenData[xPoint].stack).sortBy('name').reverse().map(function (e, k) {
              if (e.c) {
                return [_react2.default.createElement('rect', { key: e.key + 'color',
                  fill: _this2.props.getColor(e.key, _this2.props.group),
                  style: { textAnchor: "left" },
                  width: 8,
                  height: 8,
                  className: 'tooltip__color',
                  transform: 'translate(' + (rectPos + 4) + ', ' + (topDistance + 16 * stackN - 18) + ')' }), _react2.default.createElement(
                  'text',
                  { width: rectWidth + 20, height: '15',
                    key: e.name,
                    style: { textAnchor: "left" },
                    className: 'tooltip__label',
                    transform: 'translate(' + (rectPos + 14) + ', ' + (topDistance + 16 * stackN++ - 10) + ')' },
                  e.name,
                  ': ',
                  _this2.props.numberFormat(e.c)
                )];
              }
            }).value() : _react2.default.createElement(
              'text',
              { width: rectWidth, height: '15',
                style: { textAnchor: "middle" },
                className: 'tooltip__label',
                transform: 'translate(' + (rectPos + rectWidth / 2) + ', ' + (topDistance - 10) + ')' },
              this.props.numberFormat(value)
            )
          );
        }
      }
    }
  }, {
    key: 'getMetadatas',
    value: function getMetadatas() {
      var _this3 = this;

      var yPos = this.props.yScale.range()[0];
      return (0, _lodash2.default)(this.props.metadata).sortBy('date').map(function (metadatas, k) {
        var composeDescription = function composeDescription(e) {
          return ' ' + _lodash2.default.startCase(e.sub_type) + ' ' + e.type + ' (' + e.id + '): ' + e.name;
        };
        var xPos = _this3.props.xScale(metadatas.date);
        if (xPos >= _this3.props.xScale.range()[0]) {
          var metadatasKeys = _lodash2.default.keys(metadatas.data);
          var biggerDescriptionLength = (0, _lodash2.default)(metadatas.data).map(composeDescription).sortBy('length').value().pop() || "";
          var rectWidth = _this3.getTextWidth(biggerDescriptionLength, 12);
          var types = metadatasKeys.length ? (0, _lodash2.default)(metadatas.data).map('type').uniq().value() : [];
          var specificType = types.length === 1 ? types.pop() : 'multiple';
          var rectHeight = (metadatasKeys.length + 1) * 15 + 4;
          var textPos = rectHeight - 20;
          return _react2.default.createElement(
            'g',
            { key: k },
            _this3.state.visibleMetadata == k ? _react2.default.createElement(
              'g',
              { key: 'metadata-' + k },
              _react2.default.createElement('rect', { className: 'tooltip__background', rx: '4', ry: '4', transform: 'translate(' + (xPos - rectWidth / 2) + ', ' + (yPos - rectHeight - 14) + ')', width: rectWidth, height: rectHeight }),
              _react2.default.createElement(
                'text',
                { key: k + '-date',
                  width: rectWidth, height: 14,
                  style: { textAnchor: "left" },
                  className: 'tooltip__label--title',
                  transform: 'translate(' + (xPos + 5 - rectWidth / 2) + ', ' + (yPos - textPos - 21) + ')' },
                _this3.props.timeDisplay(metadatas.date),
                ':'
              ),
              _lodash2.default.map(metadatas.data, function (ml, id) {
                var text = _react2.default.createElement(
                  'text',
                  { key: k + '-' + id,
                    width: rectWidth, height: 14,
                    style: { textAnchor: "left" },
                    className: 'tooltip__label',
                    transform: 'translate(' + (xPos + 5 - rectWidth / 2) + ', ' + (yPos - textPos - 6) + ')' },
                  composeDescription(ml)
                );
                textPos = textPos - 15;
                return text;
              })
            ) : null,
            _react2.default.createElement('polygon', { className: 'ruler__metadata ruler__metadata--' + specificType,
              transform: 'translate(' + (xPos - 5) + ', ' + Math.round(yPos - 7) + ')',
              points: '5 -0.0327148438 10 3.81154584 10 9.96728516 0.164458466 9.96728516 0 3.81154584',
              onMouseEnter: _this3.onMouseEnterMetadata(k),
              onMouseLeave: _this3.onMouseLeaveMetadata
            })
          );
        }
      }).value();
    }
  }, {
    key: 'getXMark',
    value: function getXMark(date, interval) {
      var collateral = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var x = this.props.xScale;
      var y1 = this.props.yScale.range()[0];
      var y2 = this.props.yScale.range()[1];
      var intervalSize = interval || x(new Date(this.getInterval() * 1000)) - x(new Date(0));
      var pickStart = this.props.margin.left + (x(date) - x.range()[0]) % intervalSize;

      return d3.range(pickStart, x.range()[1], intervalSize).map(function (pos) {
        if (pos > x.range()[0]) {
          if (collateral) {
            return _react2.default.createElement('line', { className: 'ruler__mark', strokeDasharray: '2, 2', key: 'mark-colateral' + pos, x1: pos, x2: pos, y2: y2, y1: y1 });
          } else {
            return _react2.default.createElement('line', { className: 'ruler__mark', key: 'mark' + pos, x1: pos, x2: pos, y2: y2, y1: y1 });
          }
        }
      });
    }
  }, {
    key: 'getRuler',
    value: function getRuler(date0, date1) {
      var x = this.props.xScale;
      var dt = date1 ? Math.min(date0, date1) : date0;
      var start = x(dt);
      var end = date1 ? Math.max(x(date0), x(date1)) : null;
      var label = this.props.timeDisplay(typeof dt === 'number' ? new Date(dt) : dt);
      var y1 = this.props.yScale.range()[0];
      var y2 = this.props.yScale.range()[1];
      var textAnchor = 'middle';
      var pos = start;

      var marks = [];
      var interval = end - start;
      var intervalSize = date1 ? Math.abs(interval) : x(new Date(this.getInterval() * 1000)) - x(new Date(0));

      if (this.state.focused || this.state.overlayVisible) {
        marks.push(_react2.default.createElement(
          'g',
          { key: 'ruler' },
          _react2.default.createElement('polygon', { key: 'mark-ruler', points: '0,0 12, 0 6, 8',
            className: 'ruler', transform: 'translate(' + (pos - 6) + ', ' + (this.props.margin.top - 8) + ')' }),
          _react2.default.createElement('rect', { className: 'ruler__background', rx: '4', ry: '4', transform: 'translate(' + (pos - 60) + ', ' + (this.props.margin.top - 22) + ')', width: '120', height: '15' }),
          _react2.default.createElement(
            'text',
            { key: 'label-ruler', style: { textAnchor: textAnchor },
              className: 'ruler__label',
              transform: 'translate(' + pos + ', ' + (this.props.margin.top - 11) + ')' },
            label
          ),
          _react2.default.createElement('line', { className: 'ruler__mark', key: 'mark' + pos, x1: pos, x2: pos, y2: y2, y1: y1 })
        ));
      }

      if (this.allowComparing && date1) {
        var rulerMarkCompare = pos - interval;
        var rulerMarkRangeEnd = end;

        if (intervalSize > 60) {
          var _x4 = this.countRange(this.state.range);
          marks.push(_react2.default.createElement(
            'g',
            { key: 'interval-label' },
            _react2.default.createElement(
              'text',
              { key: 'label-ruler', style: { textAnchor: textAnchor },
                className: 'ruler__label',
                width: 60,
                transform: 'translate(' + (pos + interval / 2) + ', ' + (this.props.margin.top + 15) + ')' },
              _x4 + ' ' + (this.props.aggregation + (_x4 > 1 ? 's' : ''))
            )
          ));
        }

        var markYPos = this.props.margin.top - (intervalSize > 120 ? 22 : 40);
        var markXPos = Math.min(Math.max(intervalSize / 2, 8), 60);

        if (rulerMarkCompare < x.range()[1] && rulerMarkCompare > x.range()[0]) {
          marks.push(_react2.default.createElement(
            'g',
            { key: 'ruler-end', className: 'ruler--compare', onClick: this.onClickCompare },
            _react2.default.createElement('rect', { className: 'ruler__mark__background', rx: '4', ry: '4', transform: 'translate(' + (rulerMarkCompare - 120 + markXPos) + ', ' + markYPos + ')', width: '120', height: '15' }),
            _react2.default.createElement('polygon', { key: 'mark-ruler-end', points: '0,0 12, 0 6, 8', className: 'ruler__helper', transform: 'translate(' + (rulerMarkCompare - 6) + ', ' + (markYPos + 14) + ')' }),
            this.props.comparing ? _react2.default.createElement(
              'g',
              null,
              _react2.default.createElement('circle', { className: 'ruler__mark__close__background', cx: '6', cy: '6', r: '6', transform: 'translate(' + (rulerMarkCompare - 4 + markXPos) + ', ' + (markYPos - 6) + ')' }),
              _react2.default.createElement('path', { className: 'ruler__mark__close', transform: 'translate(' + (rulerMarkCompare - 2 + markXPos) + ', ' + (markYPos - 4) + ')', d: 'M 2,2 L 6,6 M 6,2 L 2,6' })
            ) : null,
            _react2.default.createElement(
              'text',
              { key: 'label-ruler-end', className: 'ruler__label', style: { textAnchor: textAnchor },
                transform: 'translate(' + (rulerMarkCompare - 60 + markXPos) + ', ' + (markYPos + 12) + ')' },
              this.props.comparing ? this.props.timeDisplay(x.invert(rulerMarkCompare)) : 'click to compare'
            ),
            _react2.default.createElement('line', { className: 'ruler__mark', key: 'mark' + rulerMarkCompare, x1: rulerMarkCompare, x2: rulerMarkCompare, y2: y2, y1: y1 })
          ));
        }

        if (rulerMarkRangeEnd > x.range()[0]) {
          marks.push(_react2.default.createElement(
            'g',
            { key: 'ruler-start' },
            _react2.default.createElement('rect', { className: 'ruler__mark__background', rx: '4', ry: '4', transform: 'translate(' + (rulerMarkRangeEnd - markXPos) + ', ' + markYPos + ')', width: '120', height: '15' }),
            _react2.default.createElement('polygon', { key: 'mark-ruler-start', points: '0,0 12, 0 6, 8', className: 'ruler__helper', transform: 'translate(' + (rulerMarkRangeEnd - 6) + ', ' + (markYPos + 14) + ')' }),
            _react2.default.createElement('line', { className: 'ruler__mark', key: 'mark' + rulerMarkRangeEnd, x1: rulerMarkRangeEnd, x2: rulerMarkRangeEnd, y2: y2, y1: y1 }),
            _react2.default.createElement(
              'text',
              { key: 'label-ruler-start', className: 'ruler__label', style: { textAnchor: textAnchor },
                transform: 'translate(' + (rulerMarkRangeEnd + 60 - markXPos) + ', ' + (markYPos + 12) + ')' },
              this.props.timeDisplay(x.invert(rulerMarkRangeEnd))
            )
          ));
        }
      }

      return marks;
    }
  }, {
    key: 'render',
    value: function render() {
      var x = this.props.xScale.range()[0];
      var y = this.props.yScale.range()[1];
      var width = this.props.xScale.range()[1] - x;
      var height = this.props.yScale.range()[0] - y;

      var extentFocused = false;
      var extent = [];

      if (this.state.overlayVisible && this.state.range[0] && this.state.range[1]) {
        var fromX = this.props.xScale(this.state.range[0]);
        var toX = this.props.xScale(this.state.range[1]);
        var distance = Math.abs(toX - fromX);
        var marksDefault = this.getXMark(this.state.range[0], null, true);
        var ruler = this.getRuler(this.state.range[0], this.state.range[1]);

        extentFocused = this.state.focused && this.state.mark.x >= Math.min(fromX, toX) && this.state.mark.x <= Math.max(fromX, toX);

        extent.push(_react2.default.createElement(
          'g',
          { key: 'extent' },
          marksDefault,
          ruler,
          _react2.default.createElement('rect', { className: 'extent', x: Math.min(fromX, toX), width: distance, y: y, height: height }),
          _react2.default.createElement('rect', { className: 'extent__reflect', x: Math.max(Math.min(fromX, toX) - Math.abs(toX - fromX), x), width: Math.min(distance, Math.min(fromX, toX) - x), y: y, height: height, fill: 'url(#diagonalHatch)' }),
          this.props.comparing ? _react2.default.createElement(
            'g',
            null,
            _react2.default.createElement(
              'text',
              { key: 'extent-label-a', style: { textAnchor: "middle" }, className: 'ruler__label', width: 60,
                x: Math.max(Math.min(fromX, toX) - Math.abs(toX - fromX), x),
                transform: 'translate(' + Math.min(distance, Math.min(fromX, toX) - x) / 2 + ', ' + (this.props.margin.top + 35) + ')' },
              'A'
            ),
            _react2.default.createElement(
              'text',
              { key: 'extent-label-b', style: { textAnchor: "middle" }, className: 'ruler__label', width: 60,
                x: Math.min(fromX, toX),
                transform: 'translate(' + distance / 2 + ', ' + (this.props.margin.top + 35) + ')' },
              'B'
            )
          ) : null
        ));
      } else if (this.state.date && this.props.timeDisplay) {
        extent.push([_react2.default.createElement(
          'g',
          { key: 'focus', className: 'focus' },
          this.getXMark(this.state.date, null, true),
          this.props.mouseIteractions ? this.getRuler(this.state.date) : null
        )]);
      }

      return _react2.default.createElement(
        'g',
        { className: 'overlay' },
        _react2.default.createElement(
          'pattern',
          { id: 'diagonalHatch', patternUnits: 'userSpaceOnUse', x: '0px', y: '0px', fill: '#ccc', width: '12px', height: '12px', viewBox: '0 0 12 12', enableBackground: 'new 0 0 12 12' },
          _react2.default.createElement('path', { d: 'M12,3.535V0H8.465L0,8.465V12h3.535L12,3.535z M0,0h3.535L0,3.535V0z M8.465,12L12,8.465V12H8.465z' })
        ),
        _react2.default.createElement('rect', {
          key: 'background',
          className: 'background ' + (this.state.overlayVisible ? "filtered" : "no-filtered") + ' ' + (this.state.dragging ? "dragging" : this.state.mousePressed ? "resizing" : extentFocused ? "focused" : ""),
          x: x,
          y: y,
          width: width,
          height: height,
          onMouseDown: this.onMouseClick,
          onMouseMove: this.onMouseMove,
          onMouseEnter: this.onMouseEnter,
          onMouseLeave: this.onMouseLeave,
          onMouseUp: this.onMouseRelease
        }),
        extent,
        this.types[this.props.type || "bar"](),
        this.props.metadata ? this.getMetadatas() : null,
        this.props.mouseIteractions ? this.getYMark() : null
      );
    }
  }]);

  return TimeGraphContent;
}(_react2.default.Component);

exports.default = TimeGraphContent;


TimeGraphContent.propTypes = {
  aggregation: _react2.default.PropTypes.string,
  timeDisplay: _react2.default.PropTypes.func,
  timeFormatter: _react2.default.PropTypes.func,
  onClickCompare: _react2.default.PropTypes.any,
  onFilterChange: _react2.default.PropTypes.func,
  timeUnitLengthSec: _react2.default.PropTypes.number,
  tooltipValue: _react2.default.PropTypes.number,
  xScale: _react2.default.PropTypes.func,
  yScale: _react2.default.PropTypes.func,
  margin: _react2.default.PropTypes.object,
  numberFormat: _react2.default.PropTypes.func,
  data: _react2.default.PropTypes.array,
  range: _react2.default.PropTypes.array,
  type: _react2.default.PropTypes.string,
  metadata: _react2.default.PropTypes.object,
  mouseIteractions: _react2.default.PropTypes.bool
};

TimeGraphContent.defaultProps = {
  mouseIteractions: true
};