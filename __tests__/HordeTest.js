const Horde = require('../src/Horde');
const Creature = require('../src/Creature');

describe('linkCreature', function () {
    it('should return 1 when adding a creature', function () {
        const h = new Horde();
        const c1 = new Creature();
        expect(h.count).toBe(0);
        h.linkCreature(c1);
        expect(h.count).toBe(1);
    });
});

describe('unlinkCreature', function () {
    it('should return 0 when adding then unlink a creature', function () {
        const h = new Horde();
        const c1 = new Creature();
        expect(h.count).toBe(0);
        h.linkCreature(c1);
        expect(h.count).toBe(1);
        h.unlinkCreature(c1);
        expect(h.count).toBe(0);
    });
});

describe('forEach', function () {
    it('should iterate 3 times when adding 3 creatures', function () {
        const h = new Horde();
        const c1 = new Creature();
        const c2 = new Creature();
        const c3 = new Creature();
        h.linkCreature(c1);
        h.linkCreature(c2);
        h.linkCreature(c3);
        let n = 0;
        h.creatures.forEach(() => {
            ++n;
        });
        expect(n).toBe(3);
    });
    it('should iterate 0 times when not adding creatures', function () {
        const h = new Horde();
        let n = 0;
        h.creatures.forEach(() => {
            ++n;
        });
        expect(n).toBe(0);
    });
});

describe('isCreatureActive', function () {
    it('should return false when creature has no effects', function () {
        const h = new Horde();
        const c1 = new Creature();
        h.linkCreature(c1);
        expect(h.isCreatureActive(c1)).toBeFalsy();
    });
    it('should return true when creature has a running effect and should return false when effect runs out', function () {
        const h = new Horde();
        const c1 = new Creature();
        h.linkCreature(c1);
        const oEffect = {
            id: 'eff1',
            type: 'EFFECT_LIGHT',
            amp: 0,
            duration: 10,
            data: {}
        };
        c1.mutations.addEffect({ effect: oEffect });
        expect(h.isCreatureActive(c1)).toBeTruthy();
        c1.mutations.setEffectDuration({
            effect: oEffect,
            duration: 0
        });
        expect(h.isCreatureActive(c1)).toBeFalsy();
    });
    it('should return false when creature have action with no cooldown or charges', function () {

    });
});

describe('shrinkActiveCreatureRegistry', function () {
    it('should not reduce active creature registry when effect still active', function () {
        const h = new Horde();
        const c1 = new Creature();
        h.linkCreature(c1);
        const oEffect = {
            id: 'eff1',
            type: 'EFFECT_LIGHT',
            amp: 0,
            duration: 10,
            data: {}
        };
        c1.mutations.addEffect({ effect: oEffect });
        h.setCreatureActive(c1);
        expect(h.activeCreatures).toHaveLength(1);

        c1.mutations.setEffectDuration({
            effect: oEffect,
            duration: 5
        });
        h.shrinkActiveCreatureRegistry();
        expect(h.activeCreatures).toHaveLength(1);

        c1.mutations.setEffectDuration({
            effect: oEffect,
            duration: 0
        });
        h.shrinkActiveCreatureRegistry();
        expect(h.activeCreatures).toHaveLength(0);
    });

});
