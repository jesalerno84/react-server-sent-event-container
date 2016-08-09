/*global EventSource */

import React, {Component} from 'react';
import EventSource from 'eventsource';
import getDisplayName from './getDisplayName';
import EventSourceProps from './eventSourceProps';
import createEventSource from './createEventSource';

let nextVersion = 0;

export const serverSentEventConnect = (eventSourceUrl, withCredentials = false, onOpen, onMessage, onError, eventObj) => {
    const version = nextVersion++;

    return ComponentToDecorate => {
        const displayName = `ServerSentEvent${getDisplayName(ComponentToDecorate)}`;

        class ServerSentEventComponent extends Component {
            constructor(props, context) {
                super(props, context);
                this.version = version;
                this.state = {};

                this.eventSourceProps = new EventSourceProps();
                this.eventSource = createEventSource(eventSourceUrl, withCredentials = false, this.eventSourceProps, onOpen, onMessage, onError, eventObj);
            }

            componentDidMount() {
                this._subscribe();
            }

            componentWillUnmount() {
                this._unsubscribe();
                this.eventSource.close();
            }

            render() {
                const sseProps = this.state.sseProps;
                return (
                    <ComponentToDecorate eventSource={this.eventSource} {...sseProps} />
                );
            }

            _subscribe() {
                if (!this.unsubscribe) {
                    this.unsubscribe = this.eventSourceProps.subscribe(this._handleChange.bind(this));
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

                this.version = version;
                this._subscribe();
            }
        }

        return ServerSentEventComponent;
    };
};