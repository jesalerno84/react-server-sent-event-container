export default class {
    constructor(url, options) {
        this.url = url;
        this.withCredentials = options ? options.withCredentials === true : false;
        this._listeners = {};
    }

    addEventListener(type, callback) {
        if (!(type in this._listeners)) {
            this._listeners[type] = [];
        }
        this._listeners[type].push(callback);
    }

    removeEventListener(type, callback) {
        if (!(type in this._listeners)) {
            return;
        }
        var stack = this._listeners[type];
        for (var i = 0, l = stack.length; i < l; i++) {
            if (stack[i] === callback) {
                stack.splice(i, 1);
                return this.removeEventListener(type, callback);
            }
        }
    }

    dispatchEvent(event) {
        if (!(event.type in this._listeners)) {
            return;
        }
        var stack = this._listeners[event.type];
        event.target = this;
        for (var i = 0, l = stack.length; i < l; i++) {
            stack[i].call(this, event);
        }
    }
}