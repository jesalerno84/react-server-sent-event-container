const should = require('chai').should();
import EventSource from './mockEventSource';
import createEventSource from '../src/createEventSource';
import sinon from 'sinon';

describe('createEventSource', () => {
    beforeEach(() => {
        global.EventSource = EventSource;
    });
    it('should throw an error if the eventSourceUrl is not passed in', () => {
        (() => {
            createEventSource();
        }).should.throw('eventSourceUrl is required');
    });

    it('should throw an error if the eventSourceProps is not passed in', () => {
        const eventSourceUrl = 'http://someurl.com';

        (() => {
            createEventSource(eventSourceUrl);
        }).should.throw('eventSourceProps is required');
    });

    it('should return a correctly populated EventSource', () => {
        const eventSourceUrl = 'http://someurl.com';
        const eventSourceProps = {};
        const withCredentials = false;

        const spy = sinon.spy(global, 'EventSource');

        const result = createEventSource(eventSourceUrl, withCredentials, eventSourceProps);

        result.should.be.an.instanceof(EventSource);
        spy.calledWithExactly(eventSourceUrl, {withCredentials}).should.be.true;
        result.url.should.equal(eventSourceUrl);
    });

    it('should call the passed in onOpen method when onopen called on the result', () => {
        const event = {};

        const eventSourceUrl = 'http://someurl.com';
        const eventSourceProps = {};
        const withCredentials = false;
        const onOpen = sinon.stub();
        

        const result = createEventSource(eventSourceUrl, withCredentials, eventSourceProps, onOpen);
        result.onopen(event);

        onOpen.callCount.should.equal(1);
        onOpen.calledWithExactly(eventSourceProps, result).should.be.true;
    });

    it('should call the passed in onMessage method when onmessage called on the result', () => {
        const event = {};

        const eventSourceUrl = 'http://someurl.com';
        const eventSourceProps = {};
        const withCredentials = false;
        const onOpen = sinon.stub();
        const onMessage = sinon.stub();
        

        const result = createEventSource(eventSourceUrl, withCredentials, eventSourceProps, onOpen, onMessage);
        result.onmessage(event);

        onMessage.callCount.should.equal(1);
        onMessage.calledWithExactly(event, eventSourceProps, result).should.be.true;
    });

    it('should call the passed in onError method when onerror called on the result', () => {
        const event = {};

        const eventSourceUrl = 'http://someurl.com';
        const eventSourceProps = {};
        const withCredentials = false;
        const onOpen = sinon.stub();
        const onMessage = sinon.stub();
        const onError = sinon.stub();

        const result = createEventSource(eventSourceUrl, withCredentials, eventSourceProps, onOpen, onMessage, onError);
        result.onerror(event);

        onError.callCount.should.equal(1);
        onError.calledWithExactly(event, eventSourceProps, result).should.be.true;
    });

    it('should call addEventListener for each key on eventObj that corresponds to a function', () => {
        const event = {};

        const eventSourceUrl = 'http://someurl.com';
        const eventSourceProps = {};
        const withCredentials = false;
        const onOpen = sinon.stub();
        const onMessage = sinon.stub();
        const onError = sinon.stub();
        const eventObj = {
            fn1: sinon.stub(),
            fn2: false,
            fn3: 1,
            fn4: sinon.stub()
        };

        const result = createEventSource(eventSourceUrl, withCredentials, eventSourceProps, onOpen, onMessage, onError, eventObj);
        
        Object.keys(result._listeners).length.should.equal(2);
        Object.keys(result._listeners).should.contain('fn1');
        Object.keys(result._listeners).should.not.contain('fn2');
        Object.keys(result._listeners).should.not.contain('fn3');
        Object.keys(result._listeners).should.contain('fn4');
    });
});
