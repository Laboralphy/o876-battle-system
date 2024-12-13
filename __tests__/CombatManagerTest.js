const CombatManager = require('../src/libs/combat/CombatManager')
const Creature = require('../src/Creature')
const CONSTS = require('../src/consts')
const PropertyBuilder = require('../src/PropertyBuilder')
const EntityBuilder = require('../src/EntityBuilder')
const SCHEMA = require('../src/schemas')
const SchemaValidator = require('../src/SchemaValidator')
const oSchemaValidator = new SchemaValidator()
oSchemaValidator.schemaIndex = SCHEMA
oSchemaValidator.init()

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

const bpShortbow = {
    entityType: CONSTS.ENTITY_TYPE_ITEM,
    itemType: CONSTS.ITEM_TYPE_WEAPON,
    damages: '1d6',
    size: CONSTS.WEAPON_SIZE_MEDIUM,
    weight: 3,
    proficiency: CONSTS.PROFICIENCY_WEAPON_SIMPLE,
    properties: [],
    ammoType: 'AMMO_TYPE_ARROW',
    attributes: [CONSTS.WEAPON_ATTRIBUTE_RANGED, CONSTS.WEAPON_ATTRIBUTE_AMMUNITION],
    equipmentSlots: [CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED]
}

const bpArrow = {
    entityType: CONSTS.ENTITY_TYPE_ITEM,
    itemType: CONSTS.ITEM_TYPE_AMMO,
    weight: 0.1,
    properties: [],
    ammoType: 'AMMO_TYPE_ARROW',
    equipmentSlots: [CONSTS.EQUIPMENT_SLOT_AMMO]
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
        cm.startCombat(c1, c2)
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
        cm.events.on('combat.attack', evt => {
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
    const eb = new EntityBuilder()
    eb.schemaValidator = oSchemaValidator
    const pb = new PropertyBuilder()
    it('should produce two events (one per combat) when processing combat 6 times', function () {
        const cm = new CombatManager()
        const c1 = new Creature({ blueprint: bpNormalActor, id: 'c1' })
        const c2 = new Creature({ blueprint: bpNormalActor, id: 'c2' })
        cm.startCombat(c1, c2)
        const logs = []
        cm.events.on('combat.attack', evt => {
            logs.push({
                attacker: evt.combat.attacker.id,
                target: evt.combat.defender.id,
                turn: evt.turn,
                tick: evt.tick
            })
        })
        cm.processCombats() // tick 0
        cm.processCombats() // tick 1
        cm.processCombats() // tick 2
        cm.processCombats() // tick 3
        cm.processCombats() // tick 4
        expect(logs).toEqual([])
        cm.processCombats() // tick 5 --- event !
        expect(logs).toEqual([
            { attacker: 'c1', target: 'c2', turn: 0, tick: 5 },
            { attacker: 'c2', target: 'c1', turn: 0, tick: 5 }
        ])
    })
    it('should produce more events when having extra attack bonus', function () {
        const cm = new CombatManager()
        const c1 = new Creature({ blueprint: bpNormalActor, id: 'c1' })
        const c2 = new Creature({ blueprint: bpNormalActor, id: 'c2' })
        c1.mutations.addProperty({ property: pb.buildProperty({
            type: CONSTS.PROPERTY_ATTACK_COUNT_MODIFIER,
            amp: 1
        })})
        const combat = cm.startCombat(c1, c2)
        const logs = []
        cm.events.on('combat.attack', evt => {
            logs.push({
                attacker: evt.combat.attacker.id,
                target: evt.combat.defender.id,
                turn: evt.turn,
                tick: evt.tick
            })
        })
        cm.processCombats() // tick 0
        cm.processCombats() // tick 1
        cm.processCombats() // tick 2
        cm.processCombats() // tick 3 --- event
        expect(combat.attacker.getters.getProperties).toHaveLength(1)
        expect(combat.attackerState.getRangedExtraAttackCount()).toBe(1)
        expect(combat.attackerState.getMeleeExtraAttackCount()).toBe(1)
        expect(combat.attackerState.attackCount).toBe(2)
        expect(combat.attackerState.plan).toEqual([0, 0, 1, 0, 0, 1])
        expect(logs).toEqual([
            { attacker: 'c1', target: 'c2', turn: 0, tick: 2 }
        ])
        cm.processCombats() // tick 4
        cm.processCombats() // tick 5 --- event !
        expect(logs).toEqual([
            { attacker: 'c1', target: 'c2', turn: 0, tick: 2 },
            { attacker: 'c1', target: 'c2', turn: 0, tick: 5 },
            { attacker: 'c2', target: 'c1', turn: 0, tick: 5 }
        ])
    })
    it('both creatures should rush toward each other when combat start at distance 50 and having no weapon but natural weapon', function () {
        const cm = new CombatManager()
        expect(cm.defaultDistance).toBe(0)
        cm.defaultDistance = 50
        expect(cm.defaultDistance).toBe(50)
        const c1 = new Creature({ blueprint: bpNormalActor, id: 'c1' })
        const c2 = new Creature({ blueprint: bpNormalActor, id: 'c2' })
        cm.startCombat(c1, c2)
        const logs = []
        cm.events.on('combat.attack', evt => {
            logs.push({
                type: 'combat.attack',
                attacker: evt.combat.attacker.id,
                target: evt.combat.defender.id,
                turn: evt.turn,
                tick: evt.tick
            })
        })
        cm.events.on('combat.distance', evt => {
            logs.push({
                type: 'combat.distance',
                attacker: evt.combat.attacker.id,
                target: evt.combat.defender.id,
                turn: evt.turn,
                tick: evt.tick,
                previousDistance: evt.previousDistance,
                distance: evt.distance
            })
        })
        cm.processCombats() // tick 0
        expect(logs).toEqual([
            {
                type: 'combat.distance',
                attacker: 'c1',
                target: 'c2',
                turn: 0,
                tick: 0,
                previousDistance: 50,
                distance: 20
            },
            {
                type: 'combat.distance',
                attacker: 'c2',
                target: 'c1',
                turn: 0,
                tick: 0,
                previousDistance: 20,
                distance: 5
            }
        ])
    })
    it('c1 should attack c2 with ranged weapon and c2 should rush toward c1 when c2 has bow and c2 has no ranged weapon', function () {
        const cm = new CombatManager()
        expect(cm.defaultDistance).toBe(0)
        cm.defaultDistance = 50
        expect(cm.defaultDistance).toBe(50)
        const c1 = new Creature({ blueprint: bpNormalActor, id: 'c1' })
        const c2 = new Creature({ blueprint: bpNormalActor, id: 'c2' })
        c1.equipItem(eb.createEntity(bpShortbow))
        c1.equipItem(eb.createEntity(bpArrow))
        cm.startCombat(c1, c2)
        const logs = []
        cm.events.on('combat.attack', evt => {
            logs.push({
                type: 'combat.attack',
                attacker: evt.combat.attacker.id,
                target: evt.combat.defender.id,
                turn: evt.turn,
                tick: evt.tick
            })
        })
        cm.events.on('combat.distance', evt => {
            logs.push({
                type: 'combat.distance',
                attacker: evt.combat.attacker.id,
                target: evt.combat.defender.id,
                turn: evt.turn,
                tick: evt.tick,
                previousDistance: evt.previousDistance,
                distance: evt.distance
            })
        })
        cm.processCombats() // tick 0
        expect(logs).toEqual([{
            type: 'combat.distance',
            attacker: 'c2',
            target: 'c1',
            turn: 0,
            tick: 0,
            previousDistance: 50,
            distance: 20
        }])
        cm.processCombats() // tick 1
        cm.processCombats() // tick 2
        cm.processCombats() // tick 3
        cm.processCombats() // tick 4
        expect(logs).toEqual([{
            type: 'combat.distance',
            attacker: 'c2',
            target: 'c1',
            turn: 0,
            tick: 0,
            previousDistance: 50,
            distance: 20
        }])
        cm.processCombats() // tick 5
        expect(logs).toEqual([
            {
                type: 'combat.distance',
                attacker: 'c2',
                target: 'c1',
                turn: 0,
                tick: 0,
                previousDistance: 50,
                distance: 20
            },
            {
                attacker: "c1",
                target: "c2",
                tick: 5,
                turn: 0,
                type: "combat.attack"
            },
            {
                attacker: "c2",
                target: "c1",
                tick: 5,
                turn: 0,
                type: "combat.attack"
            }
        ])
    })
})
