const { getNewManager } = require('../../src/libs/test-tools');

describe('Spell light', function () {
    describe('when in dark room', function () {
        it('should not be able to see other creatures', function () {
            const { manager: m, creatures: { c1, c2 }} = getNewManager({
                friends: ['c-deva'],
                foes: ['c-orc']
            });
            c1.dice.cheat(0.1);
            c2.dice.cheat(0.1);
            c1.mutations.setEnvironment({ environment: m.CONSTS.ENVIRONMENT_DARKNESS, value: true });
            c2.mutations.setEnvironment({ environment: m.CONSTS.ENVIRONMENT_DARKNESS, value: true });
            expect(c1.getters.getEnvironments[m.CONSTS.ENVIRONMENT_DARKNESS]).toBeTruthy();
            expect(c2.getters.getEnvironments[m.CONSTS.ENVIRONMENT_DARKNESS]).toBeTruthy();
            const c1Effects = c1.getters.getEffectSet;
            const c1Props = c1.getters.getPropertySet;
            expect(c1Effects.has(m.CONSTS.EFFECT_DARKVISION)).toBeFalsy();
            expect(c1Props.has(m.CONSTS.PROPERTY_DARKVISION)).toBeFalsy();
            expect(c1.getCreatureVisibility(c2)).toBe(m.CONSTS.CREATURE_VISIBILITY_DARKNESS);
        });
        it('should be disadvantaged on attack', function () {
            const { manager: m, creatures: { c1, c2 }} = getNewManager({
                friends: ['c-deva'],
                foes: ['c-orc']
            });
            c1.dice.cheat(0.1);
            c2.dice.cheat(0.1);
            c1.mutations.setEnvironment({ environment: m.CONSTS.ENVIRONMENT_DARKNESS, value: true });
            c2.mutations.setEnvironment({ environment: m.CONSTS.ENVIRONMENT_DARKNESS, value: true });
            const ao = m.deliverAttack(c1, c2);
            expect(ao.rollBias.result).toBeLessThan(0);
        });
        it('should not be disadvantaged any longer on attack when casting light', function () {
            const { manager: m, creatures: { c1, c2 }} = getNewManager({
                friends: ['c-deva'],
                foes: ['c-orc']
            });
            c1.dice.cheat(0.1);
            c2.dice.cheat(0.1);
            c1.mutations.setEnvironment({ environment: m.CONSTS.ENVIRONMENT_DARKNESS, value: true });
            c2.mutations.setEnvironment({ environment: m.CONSTS.ENVIRONMENT_DARKNESS, value: true });
            m.doAction(c1, 'light', c1, { freeCast: true });
            expect(c1.getters.getEffectSet.has(m.CONSTS.EFFECT_LIGHT)).toBeTruthy();
            expect(c1.getCreatureVisibility(c2)).toBe(m.CONSTS.CREATURE_VISIBILITY_VISIBLE);
            const ao = m.deliverAttack(c1, c2);
            expect(ao.rollBias.result).toBe(0);
        });
    });
});
