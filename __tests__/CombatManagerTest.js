const CombatManager = require('../src/libs/combat/CombatManager')
const Creature = require('../src/Creature')
const CONSTS = require('../src/consts')

const bpNormalActor = {
    entityType: CONSTS.ENTITY_TYPE_ACTOR,
    specie: CONSTS.SPECIE_HUMANOID,
    race: CONSTS.RACE_HUMAN,
    ac: 0,
    hp: 6,
    proficiencies: [],
    speed: 30,
    classType: CONSTS.CLASS_TYPE_TOURIST,
    level: 1,
    hd: 6,
    actions: [],
    equipment: []
}

describe('isCreatureFighting', function () {
    it('should return false when testing a non fighting creature', function () {
        const cm = new CombatManager()
        const c1 = new Creature({ blueprint: bpNormalActor })
        const c2 = new Creature({ blueprint: bpNormalActor })
        expect(cm.isCreatureFighting(c1)).toBeFalsy()
        expect(cm.isCreatureFighting(c2)).toBeFalsy()
        expect(cm.isCreatureFighting(c1, c2)).toBeFalsy()
        expect(cm.isCreatureFighting(c2, c1)).toBeFalsy()
    })
    it('should return true when testing a fighting creature', function () {
        const cm = new CombatManager()
        const c1 = new Creature({ blueprint: bpNormalActor })
        const c2 = new Creature({ blueprint: bpNormalActor })
        const c3 = new Creature({ blueprint: bpNormalActor })
        cm.startCombat(c1, c2)
        expect(cm.isCreatureFighting(c1)).toBeTruthy()
        expect(cm.isCreatureFighting(c2)).toBeTruthy()
        expect(cm.isCreatureFighting(c1, c2)).toBeTruthy()
        expect(cm.isCreatureFighting(c2, c1)).toBeTruthy()
        expect(cm.isCreatureFighting(c1, c1)).toBeFalsy()
        expect(cm.isCreatureFighting(c2, c2)).toBeFalsy()
        expect(cm.isCreatureFighting(c1, c3)).toBeFalsy()
        expect(cm.isCreatureFighting(c2, c3)).toBeFalsy()
    })
})

describe('getCombat', function () {
    it('should the same combat instance', function () {
        const cm = new CombatManager()
        const c1 = new Creature({ blueprint: bpNormalActor })
        const c2 = new Creature({ blueprint: bpNormalActor })
        const combat = cm.startCombat(c1, c2)
        expect(cm.getCombat(c1)).toBe(combat)
        const combat2 = cm.getCombat(c2)
        expect(cm.getCombat(c2)).toBe(combat2)
    })
})

describe