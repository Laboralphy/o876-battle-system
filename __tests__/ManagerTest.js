const Manager = require('../src/Manager')
const CONSTS = require("../src/consts");

const bpNormalActor = {
    entityType: CONSTS.ENTITY_TYPE_ACTOR,
    specie: CONSTS.SPECIE_HUMANOID,
    race: CONSTS.RACE_HUMAN,
    ac: 0,
    proficiencies: [],
    speed: 30,
    classType: CONSTS.CLASS_TYPE_TOURIST,
    level: 1,
    hd: 6,
    actions: [],
    equipment: []
}

describe('createEntity / destroyEntity', function () {
    it('should add creature to horde when creating creature', function () {
        const m = new Manager()
        const c1 = m.createEntity(bpNormalActor, 'c1')
        expect(Object.values(m.horde.creatures)).toHaveLength(1)
        expect(m.horde.creatures['c1']).toBeDefined()
        expect(m.horde.creatures['c1']).toBe(c1)
    })
    it('should remove creature to horde when destroying creature', function () {
        const m = new Manager()
        const c1 = m.createEntity(bpNormalActor, 'c1')
        expect(Object.values(m.horde.creatures)).toHaveLength(1)
        m.destroyEntity(c1)
        expect(m.horde.creatures['c1']).toBeUndefined()
    })
})

describe('processEntities', function () {
    it('should work fine when no creature is instanciated', function () {
        const m = new Manager()
        expect(() => m.processEntities()).not.toThrow()
    })
    it('should fire effect applied event', function () {
        const m = new Manager()
        const logs = []
        m.events.on('creature.effect.applied', evt => logs.push({
            type: 'creature.effect.applied',
            evt
        }))
        const c1 = m.createEntity(bpNormalActor, 'c1')
        const eLight = m.effectProcessor.createEffect(CONSTS.EFFECT_LIGHT)
        expect(logs).toHaveLength(0)
        m.effectProcessor.applyEffect(eLight, c1, 10)
        expect(logs).toHaveLength(1)
        expect(logs[0].evt.effect.type).toBe(CONSTS.EFFECT_LIGHT)
    })
    it('creature should be active when having a long duration effect', function () {
        const m = new Manager()
        const c1 = m.createEntity(bpNormalActor, 'c1')
        const eLight = m.effectProcessor.createEffect(CONSTS.EFFECT_LIGHT)
        expect(m.horde.isCreatureActive(c1)).toBeFalsy()
        const eApplied = m.effectProcessor.applyEffect(eLight, c1, 10)
        expect(eApplied).not.toBeNull()
        expect(eApplied.duration).toBe(10)
        const aEffects = Object
            .values(c1._store._state.effects)
            .filter(effect => effect.duration > 0)
        expect(aEffects).toHaveLength(1)
        expect(c1.getters.getEffects).toHaveLength(1)
        expect(m.horde.isCreatureActive(c1)).toBeTruthy()
    })
})