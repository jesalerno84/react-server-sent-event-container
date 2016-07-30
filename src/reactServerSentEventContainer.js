/*global EventSource */

import React, {Component} from 'react';
import getDisplayName from './getDisplayName';
import EventSourceProps from './eventSourceProps';
import createEventSource from './createEventSource';

let nextVersion = 0;

export const serverSentEventConnect = (eventSourceUrl, withCredentials = false, onOpen, onMessage, onError, eventObj) => {
    const version = nextVersion++

    return ComponentToDecorate => {
        const displayName = `ServerSentEvent${getDisplayName(ComponentToDecorate)}`;
        const eventSourceProps = new EventSourceProps();
        const eventSource = createEventSource(eventSourceUrl, withCredentials = false, eventSourceProps, onOpen, onMessage, onError, eventObj)

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