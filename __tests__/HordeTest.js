const Horde = require('../src/Horde');
const Creature = require('../src/Creature');
const {CONSTS} = require('../index');

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

describe('environment', function () {
    it('should return previously defined room environments', function () {
        const h = new Horde();
        h.setLocationEnvironments('r1', [
            CONSTS.ENVIRONMENT_DARKNESS
        ]);
        expect(h.getLocationEnvironments('r1')).toEqual([
            CONSTS.ENVIRONMENT_DARKNESS
        ]);
    });
    it('should change defined environments', function () {
        const h = new Horde();
        h.setLocationEnvironments('r1', [
            CONSTS.ENVIRONMENT_DARKNESS
        ]);
        h.setLocationEnvironments('r1', [
            CONSTS.ENVIRONMENT_WINDY
        ]);
        expect(h.getLocationEnvironments('r1')).toEqual([
            CONSTS.ENVIRONMENT_WINDY
        ]);
    });
    it('should change creature environment [] -> [darkness]', function() {
        const c = new Creature();
        const h = new Horde();
        h.updateCreatureEnvironments(c, [CONSTS.ENVIRONMENT_DARKNESS]);
        expect(c.getters.getEnvironments[CONSTS.ENVIRONMENT_DARKNESS]).toBeTruthy();
    });
    it('should change creature environment [darkness] -> []', function() {
        const c = new Creature();
        const h = new Horde();
        c.mutations.setEnvironment({ environment: CONSTS.ENVIRONMENT_DARKNESS, value: true });
        h.updateCreatureEnvironments(c, []);
        expect(c.getters.getEnvironments[CONSTS.ENVIRONMENT_DARKNESS]).toBeFalsy();
    });
    it('should return [darkness] when asking for creature in dark area', function () {
        const h = new Horde();
        h.setLocationEnvironments('r1', [
            CONSTS.ENVIRONMENT_DARKNESS
        ]);
        expect(h.getLocationEnvironments('r1')).toEqual([CONSTS.ENVIRONMENT_DARKNESS]);
        const c = new Creature();
        expect(c.id).toBeDefined();
        expect(c.getters.getEnvironments[CONSTS.ENVIRONMENT_DARKNESS]).toBeFalsy();
        h.setCreatureLocation(c, 'r1');
        expect(h.getCreatureLocation(c)).toBe('r1');
        expect(c.getters.getEnvironments[CONSTS.ENVIRONMENT_DARKNESS]).toBeTruthy();
    });
    it('should change creature environment [darkness] -> [windy]', function() {
        const c = new Creature();
        const h = new Horde();
        h.setLocationEnvironments('r1', [
            CONSTS.ENVIRONMENT_DARKNESS
        ]);
        h.setLocationEnvironments('r2', [
            CONSTS.ENVIRONMENT_WINDY
        ]);
        h.setCreatureLocation(c, 'r1');
        expect(c.getters.getEnvironments[CONSTS.ENVIRONMENT_DARKNESS]).toBeTruthy();
        expect(c.getters.getEnvironments[CONSTS.ENVIRONMENT_WINDY]).toBeFalsy();
        h.setCreatureLocation(c, 'r2');
        expect(c.getters.getEnvironments[CONSTS.ENVIRONMENT_DARKNESS]).toBeFalsy();
        expect(c.getters.getEnvironments[CONSTS.ENVIRONMENT_WINDY]).toBeTruthy();
    });
    it('should return [darkness] when adding temporary environment darkness', function () {
        const c = new Creature();
        const h = new Horde();
        const e1 = h.addTemporaryEnvironment('r1', CONSTS.ENVIRONMENT_DARKNESS, 10);
        expect(e1).toBeDefined();
        expect(e1.environment).toBe(CONSTS.ENVIRONMENT_DARKNESS);
        expect(e1.duration).toBe(10);
        expect(h.getLocationEnvironments('r1')).toEqual([CONSTS.ENVIRONMENT_DARKNESS]);
        h.depleteTemporaryEnvironmentDurations();
        expect(e1.duration).toBe(9);
        h.depleteTemporaryEnvironmentDurations();
        expect(e1.duration).toBe(8);
        h.depleteTemporaryEnvironmentDurations();
        expect(e1.duration).toBe(7);
        h.depleteTemporaryEnvironmentDurations();
        h.depleteTemporaryEnvironmentDurations();
        expect(e1.duration).toBe(5);
        h.depleteTemporaryEnvironmentDurations();
        h.depleteTemporaryEnvironmentDurations();
        expect(e1.duration).toBe(3);
        h.depleteTemporaryEnvironmentDurations();
        expect(e1.duration).toBe(2);
        h.depleteTemporaryEnvironmentDurations();
        expect(e1.duration).toBe(1);
        expect(h.getLocationEnvironments('r1')).toEqual([CONSTS.ENVIRONMENT_DARKNESS]);
        h.depleteTemporaryEnvironmentDurations();
        expect(e1.duration).toBe(0);
        expect(h.getLocationEnvironments('r1')).toEqual([]);
    });
});
