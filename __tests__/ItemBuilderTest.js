const ItemBuilder = require('../src/ItemBuilder')
const SCHEMA = require('../src/schemas')
const SchemaValidator = require('../src/SchemaValidator')
const CONSTS = require('../src/consts')

const oSchemaValidator = new SchemaValidator()
oSchemaValidator.schemaIndex = SCHEMA
oSchemaValidator.init()

describe('defineItemBlueprint', function () {
    it('define a weapon blueprint', function () {
        const ib = new ItemBuilder()
        ib.schemaValidator = oSchemaValidator
        ib.defineItemBlueprint('shortsword', {
            entityType: CONSTS.ENTITY_TYPE_ITEM,
            itemType: CONSTS.ITEM_TYPE_WEAPON,
            proficiencies: [CONSTS.PROFICIENCY_WEAPON_SIMPLE],
            damages: '1d6',
            damageTypes: [CONSTS.DAMAGE_TYPE_PIERCING],
            attributes: [CONSTS.WEAPON_ATTRIBUTE_FINESSE],
            size: CONSTS.WEAPON_SIZE_SMALL,
            weight: 2,
            properties: [],
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]
        })
    })
    it('define a weapon blueprint with an extends', function () {
        const ib = new ItemBuilder()
        ib.schemaValidator = oSchemaValidator
        ib.defineItemBlueprint('weapon-type-shortsword', {
            entityType: CONSTS.ENTITY_TYPE_ITEM,
            itemType: CONSTS.ITEM_TYPE_WEAPON,
            proficiencies: [CONSTS.PROFICIENCY_WEAPON_SIMPLE],
            damages: '1d6',
            damageTypes: [CONSTS.DAMAGE_TYPE_PIERCING, CONSTS.DAMAGE_TYPE_SLASHING],
            attributes: [CONSTS.WEAPON_ATTRIBUTE_FINESSE],
            size: CONSTS.WEAPON_SIZE_SMALL,
            weight: 6,
            properties: [],
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]
        })
        ib.defineItemBlueprint('wpn-shortsword', {
            extends: 'weapon-type-shortsword'
        })
        expect(ib.blueprints['wpn-shortsword']).toEqual({
            ref: 'wpn-shortsword',
            entityType: CONSTS.ENTITY_TYPE_ITEM,
            itemType: CONSTS.ITEM_TYPE_WEAPON,
            proficiencies: [CONSTS.PROFICIENCY_WEAPON_SIMPLE],
            damages: '1d6',
            damageTypes: [CONSTS.DAMAGE_TYPE_PIERCING, CONSTS.DAMAGE_TYPE_SLASHING],
            attributes: [CONSTS.WEAPON_ATTRIBUTE_FINESSE],
            size: CONSTS.WEAPON_SIZE_SMALL,
            weight: 6,
            properties: [],
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]
        })
    })
    it('define an armor blueprint', function () {
        const ib = new ItemBuilder()
        ib.schemaValidator = oSchemaValidator
        ib.defineItemBlueprint('light-armor', {
            entityType: CONSTS.ENTITY_TYPE_ITEM,
            itemType: CONSTS.ITEM_TYPE_ARMOR,
            proficiencies: [CONSTS.PROFICIENCY_ARMOR_LIGHT],
            ac: 2,
            weight: 20,
            properties: [
            ],
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_CHEST]
        })
    })
})
