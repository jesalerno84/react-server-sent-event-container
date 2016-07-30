/*global EventSource */

import React, {Component} from 'react';

let nextVersion = 0;

export const serverSentEventConnect = (eventSourceUrl, withCredentials = false, onOpen, onMessage, onError, eventObj) => {
    const version = nextVersion++

    return ComponentToDecorate => {
        if (!eventSourceUrl) {
            throw new Error('eventSourceUrl is required');
        }

        const displayName = `ServerSentEvent${getDisplayName(ComponentToDecorate)}`;
        const eventSourceProps = new EventSourceProps();

        const eventSource = new EventSource(eventSourceUrl, { withCredentials });
        eventSource.onopen = () => {
            onOpen(eventSourceProps, eventSource);
        };

        eventSource.onmessage = event => {
            onMessage(event, eventSourceProps, eventSource);
        };

        eventSource.onerror = event => {
            onError(event, eventSourceProps, eventSource);
        };

        if (eventObj) {
            const keys = Object.keys(eventObj);

            for (var i = 0; i < keys.length; i++) {
                const fn = eventObj[keys[i]];
                if (typeof (fn) === 'function') {
                    eventSource.addEventListener(keys[i], event => {
                        fn(event, eventSourceProps, eventSource);
                    });
                }
            }
        }

        class ServerSentEventComponent extends Component {
            constructor(props, context) {
                super(props, context);
                this.version = version;
                this.state = {};
            }

            componentDidMount() {
                this._subscribe();
            }

            componentWillUnmount() {
                this._unsubscribe();
            }

            render() {
                const sseProps = this.state.sseProps;
                return (
                    <ComponentToDecorate eventSource={eventSource} {...sseProps} />
                );
            }

            _subscribe() {
                if (!this.unsubscribe) {
                    this.unsubscribe = eventSourceProps.subscribe(this._handleChange.bind(this));
                }
            }

            _unsubscribe() {
                if (this.unsubscribe) {
                    this.unsubscribe();
                    this.unsubscribe = null;
                }
            }

            _handleChange(props) {
                if (this.unsubscribe) {
                    return;
                }

                this.setState({ sseProps: props });
            }
        }

        ServerSentEventComponent.displayName = displayName;

        if (process.env.NODE_ENV !== 'production') {
            ServerSentEventComponent.prototype.componentWillUpdate = function () {
                if (this.version === version) {
                    return;
                }

                // We are hot reloading!
                this.version = version
                this._subscribe();
                //this.clearCache()
            }
        }

        return ServerSentEventComponent;
    };
};

const getDisplayName = Component => {
    return Component.displayName || Component.name || 'Component'
};

class EventSourceProps {
    constructor() {
        this.handlers = [];
        this.props = {};
    }

    update(props) {
        this.props = {...this.props, ...props };
        this.fire(this.props);
    }

    subscribe(fn) {
        this.handlers.push(fn);
    }

    unsubscribe(fn) {
        this.handlers = this.handlers.filter(item => {
            if (item != fn) {
                return item;
            }
        });
    }

    fire(props) {
        for (var i = 0; i < this.handlers.length; i++) {
            this.handlers[i](props);
        }
    }
}