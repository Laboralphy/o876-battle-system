const Manager = require('../src/Manager');

describe('check all classic blueprints', function () {
    it ('should validate all classic blueprints', function () {
        const m = new Manager();
        m.loadModule('classic');
        let i = 0;
        for (const bp of m.blueprints.keys()) {
            const id = 'm-' + i;
            expect(() => m.createEntity(bp, id)).not.toThrow();
            ++i;
        }
    });
});
