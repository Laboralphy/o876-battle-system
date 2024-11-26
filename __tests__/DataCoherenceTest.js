const CONSTS = require('../src/consts')
const DATA = require('../src/data')

describe('conditions', function () {
    it('each condition should have its entry in data conditions', function () {
        const aConstConditions = Object
            .keys(CONSTS)
            .filter(s => s.startsWith('CONDITION_'))
            .sort((a, b) => a.localeCompare(b))
        expect(aConstConditions.length).toBeGreaterThan(0)
        const aDataConditions = Object
            .keys(DATA.CONDITIONS)
            .sort((a, b) => a.localeCompare(b))
        expect(aConstConditions).toEqual(aDataConditions)
    })
})