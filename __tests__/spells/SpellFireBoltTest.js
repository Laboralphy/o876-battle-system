const Manager = require('../../src/Manager');
const CONSTS = require('../../src/consts');

describe('Fire Bolt', function () {
    it('should cast fire bolt spell and deal 10 fire damage on unaware target', function () {
        const m = new Manager();
        const aLog = [];
        m.events.on(CONSTS.EVENT_CREATURE_DAMAGED, (evt) => {
            aLog.push(`creature ${evt.creature.id} damaged by ${evt.source.id}: ${evt.amount} ${evt.damageType}`);
        });
        m.loadModule('classic');
        m.loadModule('magic');
        const c1 = m.createEntity('c-orc', 'orc1');
        const c2 = m.createEntity('c-orc', 'orc2');
        c1.dice.cheat(0.9);
        c2.dice.cheat(0.1);
        const r = m.castSpell('fire-bolt', c1, c2, { freeCast: true });
        expect(r.reason).toBe('');
        expect(r.success).toBeTruthy();
        expect(aLog).toEqual([
            'creature orc2 damaged by orc1: 10 DAMAGE_TYPE_FIRE'
        ]);
    });
});
