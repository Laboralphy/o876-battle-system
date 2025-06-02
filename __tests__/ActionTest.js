const Manager = require('../src/Manager');
const CONSTS = require('../src/consts');

const bpTourist = {
    entityType: CONSTS.ENTITY_TYPE_ACTOR,
    specie: CONSTS.SPECIE_HUMANOID,
    race: CONSTS.RACE_HUMAN,
    ac: 0,
    proficiencies: [],
    speed: 30,
    classType: 'CLASS_TYPE_TOURIST',
    level: 5,
    hd: 6,
    actions: [],
    equipment: [
        'natwpn-punch-1d3'
    ]
};

describe('at-fightful-glare', function() {
    it('c1 should frighten c2 when saving throw success', function () {
        const m = new Manager();
        m.defineModule({
            blueprints: {
                bpTourist
            },
            data: {},
            scripts: {}
        });
        m.loadModule('classic');
        const c1 = m.createEntity('bpTourist');
        const c2 = m.createEntity('bpTourist');
        c1.mutations.defineAction({
            id: 'a1',
            actionType: CONSTS.COMBAT_ACTION_TYPE_SPELL_LIKE_ABILITY,
            cooldown: 0,
            charges: 0,
            range: Infinity,
            script: 'at-frightful-glare',
            parameters: {}
        });
        c1.dice.cheat(0.9);
        c2.dice.cheat(0.1);
        const combat = m.startCombat(c1, c2);
        expect(c2.getters.getConditionSet.has(CONSTS.CONDITION_FRIGHTENED)).toBeFalsy();
        m._combatManagerAction({
            action: c1.getters.getActions['a1'],
            combat,
            attacker: c1
        });
        expect(c2.getters.getConditionSet.has(CONSTS.CONDITION_FRIGHTENED)).toBeTruthy();
    });
    it('c1 should not frighten c2 when saving throw fails', function () {
        const m = new Manager();
        m.defineModule({
            blueprints: {
                bpTourist
            },
            data: {},
            scripts: {}
        });
        m.loadModule('classic');
        const c1 = m.createEntity('bpTourist');
        const c2 = m.createEntity('bpTourist');
        c1.mutations.defineAction({
            id: 'a1',
            actionType: CONSTS.COMBAT_ACTION_TYPE_SPELL_LIKE_ABILITY,
            cooldown: 0,
            charges: 0,
            range: Infinity,
            script: 'at-frightful-glare',
            parameters: {}
        });
        c1.dice.cheat(0.1);
        c2.dice.cheat(0.99);
        const combat = m.startCombat(c1, c2);
        expect(c2.getters.getConditionSet.has(CONSTS.CONDITION_FRIGHTENED)).toBeFalsy();
        m._combatManagerAction({
            action: c1.getters.getActions['a1'],
            combat,
            attacker: c1
        });
        expect(c2.getters.getConditionSet.has(CONSTS.CONDITION_FRIGHTENED)).toBeFalsy();
    });
});
