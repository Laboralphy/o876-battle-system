const Manager = require('../../src/Manager');
const CONSTS = require('../../src/consts');

function getNewManager () {
    const m = new Manager();
    m.combatManager.defaultDistance = 50;
    m.loadModule('classic');
    m.loadModule('magic');
    m.initFactions();
    const c1 = m.createEntity('c-orc', 'orc1');
    const c2 = m.createEntity('c-orc', 'orc2');
    const c3 = m.createEntity('c-orc', 'orc3');
    m.horde.setCreatureFaction(c1, 'player');
    m.horde.setCreatureFaction(c2, 'hostile');
    m.horde.setCreatureFaction(c3, 'hostile');
    m.horde.setCreatureLocation(c1, 'r1');
    m.horde.setCreatureLocation(c2, 'r1');
    m.horde.setCreatureLocation(c3, 'r1');
    return {
        manager: m,
        creatures: {
            c1,
            c2,
            c3
        }
    };
}

describe('should initiate combat when casting firebolt', function () {
    it ('fire-bolt should be considered as hostile', function () {
        const { manager: m, creatures: { c1, c2, c3 }} = getNewManager();
        const oSpellData = m.getSpellData('fire-bolt');
        expect(oSpellData.hostile).toBeTruthy();
    });
    it ('should initiate combat when casting firebolt', function () {
        const { manager: m, creatures: { c1, c2, c3 }} = getNewManager();
        c1.dice.cheat(0.1);
        c2.dice.cheat(0.1);
        m.doAction(c1, 'fire-bolt', c2);
        m.process();
        // c1 should be in combat targetting c2
        expect(m.combatManager.isCreatureFighting(c1, c2)).toBeTruthy();
        expect(c2.getters.isDead).toBeFalsy();
    });
    it ('spell casting should occurs at turn 1 tick 0', function () {
        const { manager: m, creatures: { c1, c2, c3 }} = getNewManager();
        const aLog = [];
        m.events.on(CONSTS.EVENT_CREATURE_ACTION, (evt) => {
            const { creature, target, action } = evt;
            aLog.push({
                event: CONSTS.EVENT_CREATURE_ACTION,
                creature: creature.id,
                target: target.id,
                spell: action.parameters.spell.id
            });
        });
        const r = m.doAction(c1, 'fire-bolt', c2);
        expect(r.success).toBeTruthy();
        const oCombat = m.getCreatureCombat(c1);
        // current action should be cast spell fire bol
        expect(oCombat).toBeDefined();
        expect(oCombat.currentAction).not.toBeNull();
        expect(oCombat.currentAction.id).toBe('cast-spell');
        expect(oCombat.currentAction.range).toBe(120);
        expect(oCombat.currentAction.parameters?.spell?.id).toBe('fire-bolt');

        m.process();
        expect(aLog.length).toBe(1);
        expect(oCombat.turn).toBe(0);
        expect(oCombat.tick).toBe(1);
    });
});
