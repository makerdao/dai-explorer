Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _raf = require('raf');

var _raf2 = _interopRequireDefault(_raf);

var _bignumber = require('bignumber.js');

var _bignumber2 = _interopRequireDefault(_bignumber);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ANIMATION_DURATION = 300;

var AnimatedNumber = function (_Component) {
    _inherits(AnimatedNumber, _Component);

    function AnimatedNumber() {
        _classCallCheck(this, AnimatedNumber);

        var _this = _possibleConstructorReturn(this, (AnimatedNumber.__proto__ || Object.getPrototypeOf(AnimatedNumber)).call(this));

        _this.state = {
            currentValue: 0
        };
        return _this;
    }

    _createClass(AnimatedNumber, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.prepareTween(this.props);
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (this.state.currentValue === nextProps.value) {
                return;
            }

            if (this.tweenHandle) {
                this.endTween();
            }

            this.prepareTween(nextProps);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.endTween();
        }
    }, {
        key: 'prepareTween',
        value: function prepareTween() {
            var _this2 = this;

            this.tweenHandle = (0, _raf2.default)(function (timestamp) {
                _this2.tweenValue(timestamp, true);
            });
        }
    }, {
        key: 'endTween',
        value: function endTween() {
            _raf2.default.cancel(this.tweenHandle);
            var value = _typeof(this.props.value) === 'object' ? this.props.value.toNumber() : this.props.value;
            this.setState(_extends({}, this.state, {
                currentValue: value
            }));
        }
    }, {
        key: 'ensureSixtyFps',
        value: function ensureSixtyFps(timestamp) {
            var currentTime = this.state.currentTime;


            return !currentTime || timestamp - currentTime > 16;
        }
    }, {
        key: 'tweenValue',
        value: function tweenValue(timestamp, start) {

            if (!this.ensureSixtyFps(timestamp)) {
                (0, _raf2.default)(this.tweenValue.bind(this));
                return;
            }

            var duration = this.props.duration;
            var value = this.props.value;

            value = (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' ? value.toNumber() : value;

            var currentValue = this.state.currentValue;

            var currentTime = timestamp;
            var startTime = start ? timestamp : this.state.startTime;
            var fromValue = start ? currentValue : this.state.fromValue;
            var newValue = void 0;

            if (currentTime - startTime >= duration) {
                newValue = value;
            } else {
                newValue = fromValue + (value - fromValue) * ((currentTime - startTime) / duration);
            }

            if (newValue === value) {
                this.endTween();
                return;
            }

            this.setState({
                currentValue: newValue,
                startTime: startTime ? startTime : currentTime,
                fromValue: fromValue, currentTime: currentTime
            });
            (0, _raf2.default)(this.tweenValue.bind(this));
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                formatValue = _props.formatValue,
                value = _props.value,
                className = _props.className,
                frameStyle = _props.frameStyle,
                stepPrecision = _props.stepPrecision;
            var _state = this.state,
                currentValue = _state.currentValue,
                fromValue = _state.fromValue;
            var style = this.props.style;

            var adjustedValue = currentValue;
            var direction = value - fromValue;

            if (currentValue !== value) {
                if (stepPrecision > 0) {
                    adjustedValue = Number(currentValue.toFixed(stepPrecision));
                } else if (direction < 0 && stepPrecision === 0) {
                    adjustedValue = Math.floor(currentValue);
                } else if (direction > 0 && stepPrecision === 0) {
                    adjustedValue = Math.ceil(currentValue);
                }
            }

            var perc = Math.abs((adjustedValue - fromValue) / (value - fromValue) * 100);

            var currStyle = frameStyle(perc);

            if (style && currStyle) {
                style = _extends({}, style, currStyle);
            } else if (currStyle) {
                style = currStyle;
            }

            var title = _props.title ? _props.title : (_typeof(this.props.value) === 'object' ? this.props.value.valueOf() : this.props.value);

            var onClick = _props.onClick ? _props.onClick : null;

            return _react2.default.createElement(this.props.component, _extends({}, filterKnownProps(this.props), { className: className, style: style, title: title, onClick: onClick }), formatValue(adjustedValue));
        }
    }]);

    return AnimatedNumber;
}(_react.Component);

AnimatedNumber.propTypes = {
    component: _propTypes2.default.any,
    formatValue: _propTypes2.default.func,
    value: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.instanceOf(_bignumber2.default)]),
    duration: _propTypes2.default.number,
    frameStyle: _propTypes2.default.func,
    stepPrecision: _propTypes2.default.number,
    style: _propTypes2.default.object,
    className: _propTypes2.default.string
};
AnimatedNumber.defaultProps = {
    component: 'span',
    formatValue: function formatValue(n) {
        return n;
    },
    duration: ANIMATION_DURATION,
    frameStyle: function frameStyle() {
        return {};
    }
};
exports.default = AnimatedNumber;


function filterKnownProps(props) {
    var sanitized = {};
    var propNames = Object.keys(props);
    var validProps = Object.keys(AnimatedNumber.propTypes);

    propNames.filter(function (p) {
        return validProps.indexOf(p) < 0;
    }).forEach(function (p) {
        sanitized[p] = props[p];
    });

    return sanitized;
};
