const EntityBuilder = require('../src/EntityBuilder')
const SCHEMA = require('../src/schemas')
const SchemaValidator = require('../src/SchemaValidator')
const CONSTS = require('../src/consts')
const Creature = require('../src/Creature')
const AttackOutcome = require('../src/AttackOutcome')

const oSchemaValidator = new SchemaValidator()
oSchemaValidator.schemaIndex = SCHEMA
oSchemaValidator.init()

const bpNormalActor = {
    entityType: CONSTS.ENTITY_TYPE_ACTOR,
    specie: CONSTS.SPECIE_HUMANOID,
    race: CONSTS.RACE_HUMAN,
    ac: 0,
    hp: 6,
    proficiencies: [
        CONSTS.PROFICIENCY_WEAPON_MARTIAL,
        CONSTS.PROFICIENCY_WEAPON_SIMPLE,
        CONSTS.PROFICIENCY_ARMOR_LIGHT,
        CONSTS.PROFICIENCY_ARMOR_MEDIUM,
        CONSTS.PROFICIENCY_ARMOR_HEAVY,
        CONSTS.PROFICIENCY_SHIELD
    ],
    speed: 30,
    classType: CONSTS.CLASS_TYPE_TOURIST,
    level: 1,
    hd: 6,
    actions: [],
    equipment: []
}

const bpBeltOfOgreStrength = {
    entityType: CONSTS.ENTITY_TYPE_ITEM,
    itemType: CONSTS.ITEM_TYPE_BELT,
    properties: [{
        type: CONSTS.PROPERTY_ABILITY_MODIFIER,
        ability: CONSTS.ABILITY_STRENGTH,
        amp: 2
    }],
    weight: 5,
    equipmentSlots: [CONSTS.EQUIPMENT_SLOT_WAIST]
}
const bpStuddedLeatherArmor = {
    entityType: CONSTS.ENTITY_TYPE_ITEM,
    itemType: CONSTS.ITEM_TYPE_ARMOR,
    properties: [],
    ac: 2,
    weight: 5,
    equipmentSlots: [CONSTS.EQUIPMENT_SLOT_CHEST],
    proficiency: CONSTS.PROFICIENCY_ARMOR_LIGHT
}
const bpDagger = {
    entityType: CONSTS.ENTITY_TYPE_ITEM,
    itemType: CONSTS.ITEM_TYPE_WEAPON,
    damages: '1d4',
    size: CONSTS.WEAPON_SIZE_SMALL,
    weight: 1,
    proficiency: CONSTS.PROFICIENCY_WEAPON_SIMPLE,
    properties: [],
    attributes: [CONSTS.WEAPON_ATTRIBUTE_FINESSE],
    equipmentSlots: [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]
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
const bpShortSword = {
    entityType: CONSTS.ENTITY_TYPE_ITEM,
    itemType: CONSTS.ITEM_TYPE_WEAPON,
    damages: '1d6',
    size: CONSTS.WEAPON_SIZE_MEDIUM,
    weight: 1,
    proficiency: CONSTS.PROFICIENCY_WEAPON_SIMPLE,
    properties: [],
    attributes: [CONSTS.WEAPON_ATTRIBUTE_FINESSE],
    equipmentSlots: [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]
}
const bpLongSword = {
    entityType: CONSTS.ENTITY_TYPE_ITEM,
    itemType: CONSTS.ITEM_TYPE_WEAPON,
    damages: '1d8',
    size: CONSTS.WEAPON_SIZE_MEDIUM,
    weight: 3,
    proficiency: CONSTS.PROFICIENCY_WEAPON_MARTIAL,
    properties: [],
    attributes: [],
    equipmentSlots: [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]
}

let eb

beforeEach(function () {
    eb = new EntityBuilder()
    eb.schemaValidator = oSchemaValidator
})

afterEach(function () {
    eb = null
})

describe('get ac', function () {
    it('should return 10', function () {
        const c1 = eb.createEntity(bpNormalActor)
        const c2 = eb.createEntity(bpNormalActor)
        const ao = new AttackOutcome()
        ao.attacker = c1
        ao.target = c2
        ao.attack()
        expect(ao.ac).toBe(10)
    })
    it('should return 12 when target has dex 14', function () {
        const c1 = eb.createEntity(bpNormalActor)
        const c2 = eb.createEntity(bpNormalActor)
        c2.mutations.setAbilityValue({ ability: CONSTS.ABILITY_DEXTERITY, value: 14 })
        const ao = new AttackOutcome()
        ao.attacker = c1
        ao.target = c2
        ao.attack()
        expect(ao.ac).toBe(12)
    })
})

describe('damages', function () {
    it('should return 4 physical damage', function () {
        const c1 = eb.createEntity(bpNormalActor)
        c1.mutations.setLevel({ value: 5 })
        c1.dice.cheat(0.5)
        const c2 = eb.createEntity(bpNormalActor)
        c2.mutations.setLevel({ value: 5 })
        const oSword = eb.createEntity(bpShortSword)
        c1.equipItem(oSword)
        const ao = new AttackOutcome()
        ao.attacker = c1
        ao.target = c2
        ao.autoSelect = true
        ao.attack()
        expect(ao.weapon).toEqual(oSword)
        expect(ao.roll).toBe(11)
        expect(ao.attackBonus).toBe(3)
        expect(ao.hit).toBeTruthy()
        expect(ao.damages.types).toEqual({ [CONSTS.DAMAGE_TYPE_PHYSICAL]: { amount: 4, resisted: 0 }})
    })
})