const EntityBuilder = require('../src/EntityBuilder')
const SCHEMA = require('../src/schemas')
const SchemaValidator = require('../src/SchemaValidator')
const CONSTS = require('../src/consts')
const Creature = require('../src/Creature')

const oSchemaValidator = new SchemaValidator()
oSchemaValidator.schemaIndex = SCHEMA
oSchemaValidator.init()

const oHumanBP = {
    specie: CONSTS.SPECIE_HUMANOID,
    race: CONSTS.RACE_HUMAN,
    ac: 10,
    hp: 6,
    proficiencies: [],
    speed: 30
}

const oTouristBP = {
    classType: CONSTS.CLASS_TYPE_TOURIST,
    hd: 6,
    proficiencies: [],
    actions: []
}

describe('PROPERTY_ABILITY_MODIFIER', function () {
    const oArmorLeatherBP = {
        entityType: CONSTS.ENTITY_TYPE_ITEM,
        itemType: CONSTS.ITEM_TYPE_ARMOR,
        ac: 1,
        proficiency: CONSTS.PROFICIENCY_ARMOR_LIGHT,
        properties: [],
        weight: 10,
        equipmentSlots: [CONSTS.EQUIPMENT_SLOT_CHEST]
    }
    it('Leather Armor should increase armor class by 1', function () {
        const eb = new EntityBuilder()
        eb.schemaValidator = oSchemaValidator
        eb.blueprints = {
            'race-human': oHumanBP,
            'class-type-tourist': oTouristBP,
            'arm-leather': oArmorLeatherBP
        }
        const oActor = eb.createEntity({
            entityType: CONSTS.ENTITY_TYPE_ACTOR,
            extends: ['race-human', 'class-type-tourist'],
            level: 1,
            equipment: []
        })
        expect(oActor.getters.getArmorClass).toBe(11)
    })
})