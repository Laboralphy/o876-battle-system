const { getNewManager } = require('../../src/libs/test-tools');
const CONSTS = require('../../src/consts');

describe('Spell Invisibility', () => {
    it('should apply invisible effect on target when out of combat', function () {
        const { manager: m, creatures: { c1, c2, c3, c4, c5 }} = getNewManager({
            friends: ['c-orc', 'c-orc', 'c-orc', 'c-orc', 'c-orc']
        });
        c1.spellcaster = true;
        m.doAction(c1, 'invisibility', c2, { freeCast: true });
        // c2 should have invisibility
        expect(c2.getters.getEffectSet.has(CONSTS.EFFECT_INVISIBILITY)).toBeTruthy();
    });
    it('should apply concentration effect on caster when casting on target', function () {
        const { manager: m, creatures: { c1, c2, c3, c4, c5 }} = getNewManager({
            friends: ['c-orc', 'c-orc', 'c-orc', 'c-orc', 'c-orc']
        });
        m.doAction(c1, 'invisibility', c2, { freeCast: true });
        // c1 should have one concetration effect
        expect(c1.getters.getEffectSet.has(CONSTS.EFFECT_CONCENTRATION)).toBeTruthy();
        expect(c1.getters.getEffects.filter(eff => eff.type === CONSTS.EFFECT_CONCENTRATION).length).toBe(1);
        const eInvis = c2.getters.getEffects.find(eff => eff.type === CONSTS.EFFECT_INVISIBILITY);
        expect(eInvis).toBeDefined();
        const eConcent = c1.getters.getEffects.find(eff => eff.type === CONSTS.EFFECT_CONCENTRATION);
        expect(eConcent).toBeDefined();
        expect(eConcent.data.effects.length).toBe(1);
        expect(eConcent.data.effects[0].target).toBe('c2');
    });
    it('should remove invisibility effect from c2 when breaking concentration effect on c1', function () {
        const { manager: m, creatures: { c1, c2, c3, c4, c5 }} = getNewManager({
            friends: ['c-orc', 'c-orc', 'c-orc', 'c-orc', 'c-orc']
        });
        c1.spellcaster = true;
        m.doAction(c1, 'invisibility', c2, { freeCast: true });
        // c1 should have one concetration effect
        expect(c1.getters.getEffectSet.has(CONSTS.EFFECT_CONCENTRATION)).toBeTruthy();
        expect(c2.getters.getEffectSet.has(CONSTS.EFFECT_INVISIBILITY)).toBeTruthy();
        m.dispellEffect(c1.getters.getEffects.find(eff => eff.type === CONSTS.EFFECT_CONCENTRATION));
        expect(c1.getters.getEffectSet.has(CONSTS.EFFECT_CONCENTRATION)).toBeFalsy();
        expect(c2.getters.getEffectSet.has(CONSTS.EFFECT_INVISIBILITY)).toBeFalsy();
    });
    it('should not be a problem to end concentration effect from c2 when invisibility is removed first from c2', function () {
        const { manager: m, creatures: { c1, c2, c3, c4, c5 }} = getNewManager({
            friends: ['c-orc', 'c-orc', 'c-orc', 'c-orc', 'c-orc']
        });
        c1.spellcaster = true;
        m.doAction(c1, 'invisibility', c2, { freeCast: true });
        expect(c1.getters.getEffectSet.has(CONSTS.EFFECT_CONCENTRATION)).toBeTruthy();
        expect(c2.getters.getEffectSet.has(CONSTS.EFFECT_INVISIBILITY)).toBeTruthy();
        m.dispellEffect(c2.getters.getEffects.find(eff => eff.type === CONSTS.EFFECT_INVISIBILITY));
        expect(c1.getters.getEffectSet.has(CONSTS.EFFECT_CONCENTRATION)).toBeTruthy();
        expect(c2.getters.getEffectSet.has(CONSTS.EFFECT_INVISIBILITY)).toBeFalsy();
        m.dispellEffect(c1.getters.getEffects.find(eff => eff.type === CONSTS.EFFECT_CONCENTRATION));
        expect(c1.getters.getEffectSet.has(CONSTS.EFFECT_CONCENTRATION)).toBeFalsy();
        expect(c2.getters.getEffectSet.has(CONSTS.EFFECT_INVISIBILITY)).toBeFalsy();
    });
    it('should replace target when casting another time', function () {
        const { manager: m, creatures: { c1, c2, c3, c4, c5 }} = getNewManager({
            friends: ['c-orc', 'c-orc']
        });
        c1.spellcaster = true;
        m.doAction(c1, 'invisibility', c2, { freeCast: true });
        expect(c2.getters.getEffectSet.has(CONSTS.EFFECT_INVISIBILITY)).toBeTruthy();
        m.process();
        m.process();
        m.process();
        m.process();
        m.process();
        m.process();
        m.doAction(c1, 'invisibility', c1, { freeCast: true });
        expect(c2.getters.getEffectSet.has(CONSTS.EFFECT_INVISIBILITY)).toBeFalsy();
        expect(c1.getters.getEffectSet.has(CONSTS.EFFECT_INVISIBILITY)).toBeTruthy();
    });
    it('should remove concentration spell on death', function () {
        const { manager: m, creatures: { c1, c2, c3, c4, c5 }} = getNewManager({
            friends: ['c-orc', 'c-orc']
        });
        c1.spellcaster = true;
        m.doAction(c1, 'invisibility', c2, { freeCast: true });
        expect(c2.getters.getEffectSet.has(CONSTS.EFFECT_INVISIBILITY)).toBeTruthy();
        const eDam = m.createEffect(CONSTS.EFFECT_DAMAGE, 1000, { damageType: CONSTS.DAMAGE_TYPE_FORCE });
        m.applyEffect(eDam, c1);
        expect(c1.getters.getEffectSet.has(CONSTS.EFFECT_CONCENTRATION)).toBeFalsy();
        expect(c2.getters.getEffectSet.has(CONSTS.EFFECT_INVISIBILITY)).toBeFalsy();
    });
    it('should remove all invisibility on all target when concentration end', function () {
        const { manager: m, creatures: { c1, c2, c3, c4, c5 }} = getNewManager({
            friends: ['c-orc', 'c-orc', 'c-orc', 'c-orc', 'c-orc']
        });
        c1.spellcaster = true;
        const x = m.doAction(c1, 'invisibility', c2, { freeCast: true, power: 4, additionalTargets: [c1, c3, c4, c5] });
        expect(x.success).toBeTruthy();
        expect(c1.getters.getEffectSet.has(CONSTS.EFFECT_INVISIBILITY)).toBeTruthy();
        expect(c2.getters.getEffectSet.has(CONSTS.EFFECT_INVISIBILITY)).toBeTruthy();
        expect(c3.getters.getEffectSet.has(CONSTS.EFFECT_INVISIBILITY)).toBeTruthy();
        expect(c4.getters.getEffectSet.has(CONSTS.EFFECT_INVISIBILITY)).toBeTruthy();
        expect(c5.getters.getEffectSet.has(CONSTS.EFFECT_INVISIBILITY)).toBeTruthy();
    });
});
