const should = require('chai').should();
import sinon from 'sinon';
import EventSourceProps from '../src/eventSourceProps';

const invalidFunctionValues = [undefined, null, 'asfd', 1, {}]

describe('eventSourceProps', () => {
    describe('constructor', () => {
        it('should have an empty array of handlers and an empty props object on instantiation', () => {
            const eventSourceProps = new EventSourceProps();

            eventSourceProps.handlers.should.be.instanceof(Array);
            eventSourceProps.handlers.length.should.equal(0);
            eventSourceProps.props.should.deep.equal({});
        });
    });

    describe('subscribe', () => {
        invalidFunctionValues.forEach(value => {
            it('should throw an error if passed in value is not a function', () => {
                const eventSourceProps = new EventSourceProps();
                (() => {
                    eventSourceProps.subscribe(value);
                }).should.throw('Only functions can be subscribed.');
            });
        });

        it('should add passed in function to the handlers array when push is called', () => {
            const fn = () => { };
            const eventSourceProps = new EventSourceProps();
            eventSourceProps.subscribe(fn);

            eventSourceProps.handlers.should.be.instanceof(Array);
            eventSourceProps.handlers.length.should.equal(1);
            eventSourceProps.handlers.should.contain(fn);
        });
    });

    describe('update', () => {
        it('should update existing props with new props and call fire()', () => {
            const oldProps = {test: 1, test2: 2};
            const newProps = {test2: 3, test3: 3};
            const eventSourceProps = new EventSourceProps();
            eventSourceProps.props = oldProps;

            const spy = sinon.spy(eventSourceProps, 'fire');
            eventSourceProps.update(newProps);

            eventSourceProps.props.test.should.equal(1);
            eventSourceProps.props.test2.should.equal(3);
            eventSourceProps.props.test3.should.equal(3);

            spy.callCount.should.equal(1);
        });
    });

    describe('unsubscribe', () => {
        it('should remove the handler if it is in the array', () => {
            const fn = () => {};
            const eventSourceProps = new EventSourceProps();
            eventSourceProps.handlers.push(fn);

            eventSourceProps.unsubscribe(fn);

            eventSourceProps.handlers.should.be.instanceof(Array);
            eventSourceProps.handlers.length.should.equal(0);
        });
    });

    describe('fire', () => {
        it('should call all the handlers with the props property', () => {
            const fn1 = sinon.mock();
            const fn2 = sinon.mock();
            const fn3 = sinon.mock();

            const eventSourceProps = new EventSourceProps();
            eventSourceProps.handlers = [fn1, fn2, fn3];
            eventSourceProps.props = {test1: 1, test2: 2, test3: 3};

            eventSourceProps.fire();

            fn1.callCount.should.equal(1);
            fn1.calledWithExactly(eventSourceProps.props).should.be.true;

            fn2.callCount.should.equal(1);
            fn2.calledWithExactly(eventSourceProps.props).should.be.true;

            fn3.callCount.should.equal(1);
            fn3.calledWithExactly(eventSourceProps.props).should.be.true;
        });
    })
});