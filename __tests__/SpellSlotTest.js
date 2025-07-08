const Manager = require('../src/Manager');
const CONSTS = require('../src/consts');

describe('getSpellSlots', function () {
    it('should have no spell slots when creating new creature', function () {
        const m = new Manager();
        m.loadModule('classic');
        m.loadModule('magic');
        const c = m.createEntity('c-orc', 'orc1');
        const ss = c.getters.getSpellSlots;
        expect(ss.every((s, i) => s.level === i && s.count === 0)).toBeTruthy();
    });
    it('should return [4, 2, 1] when setting 4 catrip, 2 level 1 and 1 level 2', function () {
        const m = new Manager();
        m.loadModule('classic');
        m.loadModule('magic');
        const c = m.createEntity('c-orc', 'orc1');
        c.mutations.setSpellSlotCount({ level: 0, count: 4 });
        c.mutations.setSpellSlotCount({ level: 1, count: 2 });
        c.mutations.setSpellSlotCount({ level: 2, count: 1 });
        const ss = c.getters.getSpellSlots;
        expect(ss.slice(0, 3).map(s => s.count)).toEqual([4, 2, 1]);
    });
});

