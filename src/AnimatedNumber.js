Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _raf = require('raf');

var _raf2 = _interopRequireDefault(_raf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ANIMATION_DURATION = 300;

var AnimatedNumber = function (_Component) {
    _inherits(AnimatedNumber, _Component);

    function AnimatedNumber() {
        _classCallCheck(this, AnimatedNumber);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AnimatedNumber).call(this));

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
            this.setState(_extends({}, this.state, {
                currentValue: this.props.value
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

            var _props = this.props;
            var value = _props.value;
            var duration = _props.duration;
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
            var _props2 = this.props;
            var formatValue = _props2.formatValue;
            var value = _props2.value;
            var className = _props2.className;
            var frameStyle = _props2.frameStyle;
            var stepPrecision = _props2.stepPrecision;
            var _state = this.state;
            var currentValue = _state.currentValue;
            var fromValue = _state.fromValue;
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

            return _react2.default.createElement(this.props.component, _extends({}, filterKnownProps(this.props), { className: className, style: style }), formatValue(adjustedValue));
        }
    }]);

    return AnimatedNumber;
}(_react.Component);

AnimatedNumber.propTypes = {
    component: _react.PropTypes.any,
    formatValue: _react.PropTypes.func,
    value: _react.PropTypes.number.isRequired,
    duration: _react.PropTypes.number,
    frameStyle: _react.PropTypes.func,
    stepPrecision: _react.PropTypes.number,
    style: _react.PropTypes.object,
    className: _react.PropTypes.string
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