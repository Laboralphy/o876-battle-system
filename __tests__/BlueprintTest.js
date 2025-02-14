const Manager = require('../src/Manager')

describe('check all classic blueprints', function () {
    it ('should validate all classic blueprints', function () {
        const m = new Manager()
        m.loadModule('classic')
        Object
            .keys(m.blueprints)
            .forEach((bp, i) => {
                const id = 'm-' + i
                expect(() => m.createEntity(bp, id)).not.toThrow()
            })
    })
})