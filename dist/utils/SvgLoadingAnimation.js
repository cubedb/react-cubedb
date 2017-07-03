'use strict';

Object.defineProperty(exports, "__esModule", {
        value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SvgLoadingAnimation = function (_React$Component) {
        _inherits(SvgLoadingAnimation, _React$Component);

        function SvgLoadingAnimation() {
                _classCallCheck(this, SvgLoadingAnimation);

                return _possibleConstructorReturn(this, (SvgLoadingAnimation.__proto__ || Object.getPrototypeOf(SvgLoadingAnimation)).apply(this, arguments));
        }

        _createClass(SvgLoadingAnimation, [{
                key: 'render',
                value: function render() {
                        var width = this.props.width || 15;
                        var height = this.props.height || 9;

                        var circleToAnimateSize = height * 0.1;
                        var circleVerticalPosition = height / 2;
                        var circleHorizontalPosition = width / 2 - circleToAnimateSize * 2.5;

                        var opacityStart = 0.2;
                        var opacityEnd = 0.5;

                        var animationDuration = '1.2s';

                        return _react2.default.createElement(
                                'g',
                                null,
                                _react2.default.createElement(
                                        'circle',
                                        { cx: circleHorizontalPosition + circleToAnimateSize, cy: circleVerticalPosition, r: circleToAnimateSize },
                                        _react2.default.createElement('animate', { attributeName: 'r', from: circleToAnimateSize, to: circleToAnimateSize,
                                                begin: '0s', dur: animationDuration,
                                                values: circleToAnimateSize + ';' + circleToAnimateSize * 0.6 + ';' + circleToAnimateSize, calcMode: 'linear',
                                                repeatCount: 'indefinite' }),
                                        _react2.default.createElement('animate', { attributeName: 'fill-opacity', from: opacityEnd, to: opacityEnd,
                                                begin: '0s', dur: animationDuration,
                                                values: opacityEnd + ';' + opacityStart + ';' + opacityEnd, calcMode: 'linear',
                                                repeatCount: 'indefinite' })
                                ),
                                _react2.default.createElement(
                                        'circle',
                                        { cx: circleHorizontalPosition + circleToAnimateSize * 3, cy: circleVerticalPosition, r: circleToAnimateSize * 0.6, fillOpacity: opacityEnd },
                                        _react2.default.createElement('animate', { attributeName: 'r', from: circleToAnimateSize * 0.6, to: circleToAnimateSize * 0.6,
                                                begin: '0s', dur: animationDuration,
                                                values: circleToAnimateSize * 0.6 + ';' + circleToAnimateSize + ';' + circleToAnimateSize * 0.6, calcMode: 'linear',
                                                repeatCount: 'indefinite' }),
                                        _react2.default.createElement('animate', { attributeName: 'fill-opacity', from: opacityStart, to: opacityStart,
                                                begin: '0s', dur: animationDuration,
                                                values: opacityStart + ';' + opacityEnd + ';' + opacityStart, calcMode: 'linear',
                                                repeatCount: 'indefinite' })
                                ),
                                _react2.default.createElement(
                                        'circle',
                                        { cx: circleHorizontalPosition + circleToAnimateSize * 5, cy: circleVerticalPosition, r: circleToAnimateSize },
                                        _react2.default.createElement('animate', { attributeName: 'r', from: circleToAnimateSize, to: circleToAnimateSize,
                                                begin: '0s', dur: animationDuration,
                                                values: circleToAnimateSize + ';' + circleToAnimateSize * 0.6 + ';' + circleToAnimateSize, calcMode: 'linear',
                                                repeatCount: 'indefinite' }),
                                        _react2.default.createElement('animate', { attributeName: 'fill-opacity', from: opacityEnd, to: opacityEnd,
                                                begin: '0s', dur: animationDuration,
                                                values: opacityEnd + ';' + opacityStart + ';' + opacityEnd, calcMode: 'linear',
                                                repeatCount: 'indefinite' })
                                )
                        );
                }
        }]);

        return SvgLoadingAnimation;
}(_react2.default.Component);

exports.default = SvgLoadingAnimation;