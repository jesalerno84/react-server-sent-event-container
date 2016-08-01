const should = require('chai').should();
const getDisplayName = require('../src/getDisplayName');

describe('getDisplayName', () => {
    it('should return \'Component\' if no displayName or name property on component', () => {
        const Component = {};

        const result = getDisplayName(Component);

        result.should.equal('Component');
    });

    it('should return displayName if present', () => {
        const SomeComponent = {
            displayName: 'SomeComponentDisplayName',
            name: 'SomeComponentName'
        };

        const result = getDisplayName(SomeComponent);

        result.should.equal(SomeComponent.displayName);
    });

    it('should return name if present and displayName is not', () => {
        const SomeComponent = {
            name: 'SomeComponentName'
        };

        const result = getDisplayName(SomeComponent);

        result.should.equal(SomeComponent.name);
    });
});