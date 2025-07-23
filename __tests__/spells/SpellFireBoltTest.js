const Manager = require('../../src/Manager');
const CONSTS = require('../../src/consts');
const { getNewManager } = require('./tools/get-new-manager');

describe('Fire Bolt', function () {
    it('should cast fire bolt spell and deal 10 fire damage on unaware target', function () {
        const { manager: m, creatures: { c1, c2 }} = getNewManager();
        const aLog = [];
        m.events.on(CONSTS.EVENT_CREATURE_ACTION, (evt) => {
            /**
             * @var evt {CombatActionEvent}
             */
            const {
                creature,
                target,
                action
            } = evt;
            switch (action.actionType) {
            case CONSTS.COMBAT_ACTION_TYPE_SPELL: {
                if (action.parameters.potion) {
                    aLog.push(`${creature.id} drinks potion of ${action.id}`);
                } else if (action.parameters.grenade) {
                    aLog.push(`${creature.id} throws grenade of ${action.id} at ${target.id}`);
                } else {
                    aLog.push(`${creature.id} casts ${action.parameters.spell.id} ${action.parameters.freeCast ? '(free) ' : ''}at ${target.id}`);
                }
            }
            }
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
