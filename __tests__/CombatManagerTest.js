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
    it('should create 2 combat when starting one combat', function () {
        const cm = new CombatManager()
        const c1 = new Creature({ blueprint: bpNormalActor })
        const c2 = new Creature({ blueprint: bpNormalActor })
        expect(cm.combats).toHaveLength(0)
        const combat = cm.startCombat(c1, c2)
        expect(cm.getCombat(c1) === combat).toBeTruthy()
        const combat2 = cm.getCombat(c2)
        expect(cm.getCombat(c2) === combat2).toBeTruthy()
        expect(cm.combats).toHaveLength(2)
    })
})

describe('endCombat', function () {
    it('should destroy a combat when fighter is leaving', function () {
        const cm = new CombatManager()
        const c1 = new Creature({ blueprint: bpNormalActor })
        const c2 = new Creature({ blueprint: bpNormalActor })
        const combat = cm.startCombat(c1, c2)
        expect(cm.combats).toHaveLength(2)
        cm.endCombat(c1, true)
        expect(cm.combats).toHaveLength(0)
    })
})

describe('fleeCombat', function () {
    it('should do a parting strike before fleeing combat', function () {
        const cm = new CombatManager()
        const c1 = new Creature({ blueprint: bpNormalActor })
        const c2 = new Creature({ blueprint: bpNormalActor })
        const combat = cm.startCombat(c1, c2)
        const logs = []
        cm.events.on('combat.action', evt => {
            logs.push(evt)
        })
        cm.fleeCombat(c2)
        expect(logs.length).toBe(1)
        expect(logs[0].combat === combat).toBeTruthy()
        expect(logs[0].attacker).toBe(c1)
        expect(logs[0].target).toBe(c2)
        expect(logs[0].count).toBe(1)
        expect(logs[0].opportunity).toBeTruthy()
    })
})

describe('advancing combat', function () {

})