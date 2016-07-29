'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.reactServerSentEventContainer = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*global EventSource */

var reactServerSentEventContainer = exports.reactServerSentEventContainer = function reactServerSentEventContainer(eventSourceUrl, onOpen, onMessage, onError, eventObj) {
    var withCredentials = arguments.length <= 5 || arguments[5] === undefined ? false : arguments[5];

    return function (componentToDecorate) {
        if (!eventSourceUrl) {
            throw new Error('eventSourceUrl is required');
        }

        var displayName = 'ServerSentEvent' + getDisplayName(componentToDecorate);
        var eventSourceProps = new EventSourceProps();

        var ServerSentEventComponent = function (_Component) {
            _inherits(ServerSentEventComponent, _Component);

            function ServerSentEventComponent(props, context) {
                _classCallCheck(this, ServerSentEventComponent);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(ServerSentEventComponent).call(this, props, context));
            }

            _createClass(ServerSentEventComponent, [{
                key: 'componentDidMount',
                value: function componentDidMount() {
                    if (!this.unsubscribe) {
                        this.unsubscribe = eventSourceObserver.subscribe();
                    }
                }
            }, {
                key: 'render',
                value: function render() {
                    return _react2.default.createElement('componentToDecorate', null);
                }
            }, {
                key: '_handleChange',
                value: function _handleChange(props) {
                    if (this.unsubscribe) {
                        return;
                    }

                    console.log(props);
                }
            }]);

            return ServerSentEventComponent;
        }(_react.Component);

        ServerSentEventComponent.displayName = displayName;

        var eventSource = new EventSource(eventSourceUrl, { withCredentials: withCredentials });
        eventSource.onopen = function () {
            onOpen(eventSourceProps, eventSource);
        };

        eventSource.onmessage = function (event) {
            onMessage(event, eventSourceProps, eventSource);
        };

        eventSource.onerror = function (event) {
            onError(event, eventSourceProps, eventSource);
        };

        return ServerSentEventComponent;
    };
};

var getDisplayName = function getDisplayName(component) {
    return component.displayName || component.name || 'Component';
};

var EventSourceProps = function () {
    function EventSourceProps() {
        _classCallCheck(this, EventSourceProps);

        this.handlers = [];
        this.props = {};
    }

    _createClass(EventSourceProps, [{
        key: 'update',
        value: function update(props) {
            this.props = _extends({}, this.props, props);
            this.fire(this.props);
        }
    }, {
        key: 'subscribe',
        value: function subscribe(fn) {
            this.handlers.push(fn);
        }
    }, {
        key: 'unsubscribe',
        value: function unsubscribe(fn) {
            this.handlers = this.handlers.filter(function (item) {
                if (item != fn) {
                    return item;
                }
            });
        }
    }, {
        key: 'fire',
        value: function fire(o, thisObj) {
            var scope = thisObj || window;
            this.handlers.forEach(function (handler) {
                handler.call(scope, o);
            });
        }
    }]);

    return EventSourceProps;
}();
//# sourceMappingURL=reactServerSentEventContainer.js.map