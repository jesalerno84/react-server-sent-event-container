# react-server-sent-event-container
This is a wrapper container for a React component for listening to Server Sent Events.

[![Build Status](https://travis-ci.org/jesalerno84/react-server-sent-event-container.svg?branch=master)](https://travis-ci.org/jesalerno84/react-server-sent-event-container)
[![Code Climate](https://codeclimate.com/github/jesalerno84/react-server-sent-event-container/badges/gpa.svg)](https://codeclimate.com/github/jesalerno84/react-server-sent-event-container)
[![Test Coverage](https://codeclimate.com/github/jesalerno84/react-server-sent-event-container/badges/coverage.svg)](https://codeclimate.com/github/jesalerno84/react-server-sent-event-container/coverage)

## Installation
```
npm install react-server-sent-event-container
```
## Usage
First import react and react-server-sent-event-container and 
set up your component
```jsx
import React from 'react';
import {serverSentEventConnect} from 'react-server-sent-event-container';
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
```
