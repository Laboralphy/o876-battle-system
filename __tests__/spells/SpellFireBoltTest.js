const CONSTS = require('../../src/consts');
const { getNewManager } = require('../../src/libs/test-tools');

describe('Fire Bolt', function () {
    it('should cast fire bolt spell and deal 10 fire damage on unaware target', function () {
        const { manager: m, creatures: { c1, c2 }} = getNewManager();
        const aLog = [];
        m.events.on(CONSTS.EVENT_CREATURE_CAST_SPELL, (evt) => {
            /**
             * @var evt {CombatActionEvent}
             */
            const {
                creature,
                target,
                spell,
                freeCast
            } = evt;
            aLog.push(`${creature.id} casts ${spell.id} ${freeCast ? '(free) ' : ''}at ${target.id}`);
        });
        m.events.on(CONSTS.EVENT_CREATURE_DAMAGED, (evt) => {
            aLog.push(`${evt.creature.id} damaged by ${evt.source.id}: ${evt.amount} ${evt.damageType}`);
        });
        c1.dice.cheat(0.9);
        c2.dice.cheat(0.1);
        const r = m.doAction(c1, 'fire-bolt', c2, { freeCast: true });
        expect(r.reason).toBe('');
        expect(r.success).toBeTruthy();
        m.process();
        const combat = m.getCreatureCombat(c1);
        expect(aLog).toEqual([
            'orc1 casts fire-bolt (free) at orc2',
            'orc2 damaged by orc1: 10 DAMAGE_TYPE_FIRE'
        ]);
    });
});
