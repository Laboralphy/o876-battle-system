const Manager = require('../../src/Manager');
const CONSTS = require('../../src/consts');

describe('ProtectFromSpecieEffect', function () {
    it('should apply effect with no problem', function () {
        const m = new Manager();
        m.loadModule('classic');
        const c1 = m.createEntity('c-tourist', 'c1');
        c1.mutations.setLevel({ value: 20 });
        c1.hitPoints = c1.getters.getMaxHitPoints;
        const c2 = m.createEntity('c-zombie');
        const e1 = m.createEffect(CONSTS.EFFECT_PROTECTION_FROM_SPECIES, 0, { species: [CONSTS.SPECIE_UNDEAD] });
        m.applyEffect(e1, c1, 10);
        const cb1 = m.startCombat(c2, c1);
        cb1.distance = 5;
        const ao = m.deliverAttack(c2, c1);
        expect(c2.getters.getSpecie).toBe(CONSTS.SPECIE_UNDEAD);
        expect(c1.getters.getSpecieProtectionSet.has(CONSTS.SPECIE_UNDEAD)).toBeTruthy();
        expect(ao.failed).toBeFalsy();
        expect(ao.failure).toBe('');
        expect(ao.rollBias.result).toBe(-1);
        expect(ao.rollBias.disadvantages.has('dis-attack-roll-target-protected'));
    });
});
