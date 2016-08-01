/**
 * Container for props that come from the Server Sent Events
 */
export default class EventSourceProps {
    constructor() {
        this.handlers = [];
        this.props = {};
    }

    update(props) {
        this.props = {...this.props, ...props };
        this.fire();
    }

    subscribe(fn) {
        if (typeof (fn) !== 'function') {
            throw new Error('Only functions can be subscribed.');
        }

        this.handlers.push(fn);
    }

    unsubscribe(fn) {
        this.handlers = this.handlers.filter(item => {
            if (item != fn) {
                return item;
            }
        });
    }

    fire() {
        for (var i = 0; i < this.handlers.length; i++) {
            this.handlers[i](this.props);
        }
    }
}