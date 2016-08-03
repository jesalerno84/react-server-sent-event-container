# react-server-sent-event-container
This is a wrapper container for a React component for listening to Server Sent Events and binding 
results of the Events to the props of the component.

[![Build Status](https://travis-ci.org/jesalerno84/react-server-sent-event-container.svg?branch=master)](https://travis-ci.org/jesalerno84/react-server-sent-event-container)
[![Code Climate](https://codeclimate.com/github/jesalerno84/react-server-sent-event-container/badges/gpa.svg)](https://codeclimate.com/github/jesalerno84/react-server-sent-event-container)
[![Test Coverage](https://codeclimate.com/github/jesalerno84/react-server-sent-event-container/badges/coverage.svg)](https://codeclimate.com/github/jesalerno84/react-server-sent-event-container/coverage)

## Installation
```
npm install react-server-sent-event-container
```
## Usage

First import react and serverSentEventConnect
```javascript
import React from 'react';
import {serverSentEventConnect} from 'react-server-sent-event-container';
```
Set up your component.  The eventSource prop corresponds the the EventSource created 
in the wrapper component for your SSE endpoint.

The following code gives an example of how you can use that EventSource.
```jsx
const Event = ({
    message,
    eventSource
}) => (
        <div>
            <h2>Testing events</h2>
            <p>{message}</p>
            <button onClick={ev => stopSSE(ev, eventSource) }>STOP</button>
        </div>
    );

const stopSSE = (ev, eventSource) => {
    ev.preventDefault();
    eventSource.close();
}
```

### Optionally define a function for each of the basic EventSource methods

EventSource.onopen receives the EventSourceProps and the EventSource:
```javascript
const onOpen = (props, source) => {
    console.log('open');
};
```
EventSource.onmessage receives the event, EventSourceProps, and the EventSource:
```javascript
const onMessage = (event, props, source) => {
    const item = JSON.parse(event.data);
    props.update({'message': item.msg});
};
```
EventSource.onerror receives the event, EventSourceProps, and the EventSource:
```javascript
const onError = (event, props, source) => {
    console.log('error');
    console.log(event);
    source.close();
}
```
The eventObj is key-value pairs of named messages and the function that should fire 
when those messages are received. In this case when a SSE returns this:
```
event: someevent
data: {msg: 'something'}
```
The function that is the value of the somevent key on eventObj will be called.

```javascript
const eventObj = {
    someevent: (event, props, source) => {
        const item = JSON.parse(event.data);
        props.update({'message': item.msg});
    }
}
```
Pass the url, withCredentials, and optional onOpen, onMessage, onError, and eventObj to 
serverSentConnect and then pass your component to the resulting function.
```javascript
export default serverSentEventConnect('http://someurl', false, onOpen, onMessage, onError, eventObj)(Event);
```

## License
MIT