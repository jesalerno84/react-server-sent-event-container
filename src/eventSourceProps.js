export default class EventSourceProps {
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