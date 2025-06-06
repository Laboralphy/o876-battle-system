const Manager = require('../src/Manager');
const Creature = require('../src/Creature');
const { deepEqual } = require('@laboralphy/object-fusion');

function findDuplicates(arr) {
    const duplicates = [];
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (deepEqual(arr[i], arr[j]) && !duplicates.some(item => deepEqual(item, arr[i]))) {
                duplicates.push(arr[i]);
            }
        }
    }
    return duplicates;
}

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

    it ('check one', function () {
        const m = new Manager();
        m.loadModule('classic');
        const n = 0;
        const id = 'm-0';
        const oCreature = m.createEntity('c-mummy', id);
        const aProperties = oCreature.getters.getProperties.map(p => {
            const { id, ...otherProps } = p;
            return otherProps;
        });
        const aDup = findDuplicates(aProperties);
        expect(aDup).toEqual([]);
    });

    it ('no blueprint should have twice same prop', function () {
        const m = new Manager();
        m.loadModule('classic');
        let i = 0;
        const aLog = [];
        for (const bp of m.blueprints.keys()) {
            const id = 'm-' + i;
            const oCreature = m.createEntity(bp, id);
            if (oCreature instanceof Creature) {
                const aProperties = oCreature.getters.getProperties;
                const aDup = findDuplicates(aProperties);
                if (aDup.length > 0) {
                    aLog.push({
                        blueprint: bp,
                        dup: aDup
                    });
                }
            }
            ++i;
        }
        expect(aLog).toEqual([]);
    });
});
