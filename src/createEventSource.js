export default (eventSourceUrl, withCredentials = false, eventSourceProps, onOpen, onMessage, onError, eventObj) => {
    if (!eventSourceUrl) {
        throw new Error('eventSourceUrl is required');
    }

    if (!eventSourceProps) {
        throw new Error('eventSourceProps is required');
    }

    const eventSource = new EventSource(eventSourceUrl, { withCredentials });

    if (onOpen) {
        eventSource.onopen = () => {
            onOpen(eventSourceProps, eventSource);
        };
    }

    if (onMessage) {
        eventSource.onmessage = event => {
            onMessage(event, eventSourceProps, eventSource);
        };
    }

    if (onError) {
        eventSource.onerror = event => {
            onError(event, eventSourceProps, eventSource);
        };
    }

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

    return eventSource;
};