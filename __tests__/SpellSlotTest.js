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
    it('should return [4, 2, 1] when setting 4 cantrip, 2 level 1 and 1 level 2', function () {
        const m = new Manager();
        m.loadModule('classic');
        m.loadModule('magic');
        const c = m.createEntity('c-orc', 'orc1');
        c.mutations.setSpellSlot({ level: 0, count: 4 });
        c.mutations.setSpellSlot({ level: 1, count: 2 });
        c.mutations.setSpellSlot({ level: 2, count: 1 });
        const ss = c.getters.getSpellSlots;
        expect(ss.slice(0, 3).map(s => s.count)).toEqual([4, 2, 1]);
    });
    it('should return [Infinity, 2, 1] when setting Infinity cantrip, 2 level 1 and 1 level 2', function () {
        const m = new Manager();
        m.loadModule('classic');
        m.loadModule('magic');
        const c = m.createEntity('c-orc', 'orc1');
        c.mutations.setSpellSlot({ level: 0, count: Infinity });
        c.mutations.setSpellSlot({ level: 1, count: 2 });
        c.mutations.setSpellSlot({ level: 2, count: 1 });
        const ss = c.getters.getSpellSlots;
        expect(ss.slice(0, 3).map(s => s.count)).toEqual([Infinity, 2, 1]);
    });
});

describe('consuming spell slots', function () {
    it('should return [2, 0] when setting slots and consuming one of level 2', function () {
        const m = new Manager();
        m.loadModule('classic');
        m.loadModule('magic');
        const c = m.createEntity('c-orc', 'orc1');
        c.mutations.setSpellSlot({ level: 1, count: 2 });
        c.mutations.setSpellSlot({ level: 2, count: 1 });
        c.mutations.useSpellSlot({ level: 2 });
        expect(c.getters.getSpellSlots.slice(1, 3).map(s => s.count)).toEqual([2, 1]);
        expect(c.getters.getSpellSlots.slice(1, 3).map(s => s.remaining)).toEqual([2, 0]);
    });
    it('should false when trying to consume more slot thant available in slot level 2', function () {
        const m = new Manager();
        m.loadModule('classic');
        m.loadModule('magic');
        const c = m.createEntity('c-orc', 'orc1');
        c.mutations.setSpellSlot({ level: 1, count: 2 });
        c.mutations.setSpellSlot({ level: 2, count: 1 });
        expect(c.mutations.useSpellSlot({ level: 2 })).toBeTruthy();
        expect(c.mutations.useSpellSlot({ level: 2 })).toBeFalsy();
    });
});

describe('cooldown and recharging spell slot', function () {
    it('should return cooldown 0 and ready true when asking for a cooldown after using spell slot 1, because there are 1 remaining slot', function () {
        const m = new Manager();
        m.loadModule('classic');
        m.loadModule('magic');
        const c = m.createEntity('c-orc', 'orc1');
        c.mutations.setSpellSlot({ level: 1, count: 2, cooldown: 3 });
        c.mutations.setSpellSlot({ level: 2, count: 1, cooldown: 6 });
        c.mutations.useSpellSlot({ level: 1 });
        expect(c.getters.getSpellSlots[1]).toEqual({
            level: 1,
            count: 2,
            used: 1,
            remaining: 1,
            cooldown: 0,
            ready: true
        });
    });
    it('should return cooldown 6 when asking for a cooldown after using spell slot 2', function () {
        const m = new Manager();
        m.loadModule('classic');
        m.loadModule('magic');
        const c = m.createEntity('c-orc', 'orc1');
        c.mutations.setSpellSlot({ level: 1, count: 2, cooldown: 3 });
        c.mutations.setSpellSlot({ level: 2, count: 1, cooldown: 6 });
        c.mutations.useSpellSlot({ level: 2 });
        expect(c.getters.getSpellSlots[2]).toEqual({
            level: 2,
            count: 1,
            ready: false,
            used: 1,
            remaining: 0,
            cooldown: 6
        });
    });
    it('should recharge spell slot when waiting for +6 turns', function () {
        const m = new Manager();
        m.loadModule('classic');
        m.loadModule('magic');
        const c = m.createEntity('c-orc', 'orc1');
        c.mutations.setSpellSlot({ level: 1, count: 2, cooldown: 3 });
        c.mutations.setSpellSlot({ level: 2, count: 1, cooldown: 6 });
        c.mutations.useSpellSlot({ level: 2 });
        expect(c.getters.getSpellSlots[2].cooldown).toBe(6);
        c.mutations.rechargeSpellSlots();
        expect(c.getters.getSpellSlots[2].cooldown).toBe(5);
        c.mutations.useSpellSlot({ level: 1 });
        expect(c.getters.getSpellSlots[1].cooldown).toBe(0); // level 1 can still be used (2 slots)
        expect(c.getters.getSpellSlots[1].remaining).toBe(1);
        c.mutations.rechargeSpellSlots();
        c.mutations.useSpellSlot({ level: 1 });
        expect(c.getters.getSpellSlots[1].remaining).toBe(0);
        expect(c.getters.getSpellSlots[1].cooldown).toBe(2);
        expect(c.getters.getSpellSlots[2].cooldown).toBe(4);
        c.mutations.rechargeSpellSlots();
        expect(c.getters.getSpellSlots[1].cooldown).toBe(1);
        expect(c.getters.getSpellSlots[2].cooldown).toBe(3);
        c.mutations.rechargeSpellSlots();
        expect(c.getters.getSpellSlots[2].cooldown).toBe(2);
        c.mutations.rechargeSpellSlots();
        expect(c.getters.getSpellSlots[2].cooldown).toBe(1);
        expect(c.getters.getSpellSlots[2].ready).toBeFalsy();
        c.mutations.rechargeSpellSlots();
        expect(c.getters.getSpellSlots[2].ready).toBeTruthy();
    });
});
