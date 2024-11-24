const EntityBuilder = require('../src/EntityBuilder')
const SCHEMA = require('../src/schemas')
const SchemaValidator = require('../src/SchemaValidator')
const CONSTS = require('../src/consts')
const Creature = require('../src/Creature')

const oSchemaValidator = new SchemaValidator()
oSchemaValidator.schemaIndex = SCHEMA
oSchemaValidator.init()


describe('getSlotProperties', function () {
    it('should return a built property with AC bonus when creature is equipped with armor', function () {
        const eb = new EntityBuilder()
        eb.schemaValidator = oSchemaValidator
        const oArmor = eb.createEntity({
            entityType: CONSTS.ENTITY_TYPE_ITEM,
            itemType: CONSTS.ITEM_TYPE_ARMOR,
            ac: 1,
            proficiency: CONSTS.PROFICIENCY_ARMOR_LIGHT,
            properties: [],
            weight: 10,
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_CHEST]
        })
        const oMagicArmor = eb.createEntity({
            entityType: CONSTS.ENTITY_TYPE_ITEM,
            itemType: CONSTS.ITEM_TYPE_ARMOR,
            ac: 1,
            proficiency: CONSTS.PROFICIENCY_ARMOR_LIGHT,
            properties: [{
                type: CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER,
                amp: 1
            }],
            weight: 10,
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_CHEST]
        })
        const oCreature = eb.createEntity({
            entityType: CONSTS.ENTITY_TYPE_ACTOR,
            specie: CONSTS.SPECIE_HUMANOID,
            race: CONSTS.RACE_HUMAN,
            ac: 10,
            hp: 6,
            proficiencies: [],
            speed: 30,
            classType: CONSTS.CLASS_TYPE_TOURIST,
            level: 1,
            hd: 6,
            actions: [],
            equipment: []
        })
        expect(oCreature.getters.getSlotProperties).toEqual({})
        oCreature.equipItem(oArmor)
        expect(oCreature.getters.getSlotProperties).toEqual({ [CONSTS.EQUIPMENT_SLOT_CHEST]: [] })
        oCreature.equipItem(oMagicArmor)
        expect(oCreature.getters.getSlotProperties).toEqual({
            [CONSTS.EQUIPMENT_SLOT_CHEST]: [{
                type: CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER,
                amp: 1,
                data: {
                    attackType: CONSTS.ATTACK_TYPE_ANY,
                    damageType: CONSTS.DAMAGE_TYPE_ANY
                }
            }]
        })
        const oDragonArmor = eb.createEntity({
            entityType: CONSTS.ENTITY_TYPE_ITEM,
            itemType: CONSTS.ITEM_TYPE_ARMOR,
            ac: 1,
            proficiency: CONSTS.PROFICIENCY_ARMOR_LIGHT,
            properties: [{
                type: CONSTS.PROPERTY_DAMAGE_RESISTANCE,
                damageType: CONSTS.DAMAGE_TYPE_FIRE
            }],
            weight: 10,
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_CHEST]
        })
        oCreature.equipItem(oDragonArmor)
        const oRingOfFireProtection = eb.createEntity({
            entityType: CONSTS.ENTITY_TYPE_ITEM,
            itemType: CONSTS.ITEM_TYPE_RING,
            ac: 0,
            proficiency: '',
            properties: [{
                type: CONSTS.PROPERTY_DAMAGE_RESISTANCE,
                damageType: CONSTS.DAMAGE_TYPE_FIRE
            }],
            weight: 0.1,
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_FINGER_RIGHT, CONSTS.EQUIPMENT_SLOT_FINGER_LEFT]
        })
        oCreature.equipItem(oRingOfFireProtection)
        expect(oCreature.getters.getSlotProperties).toEqual({
            [CONSTS.EQUIPMENT_SLOT_CHEST]: [{
                type: CONSTS.PROPERTY_DAMAGE_RESISTANCE,
                amp: 0,
                data: {
                    damageType: CONSTS.DAMAGE_TYPE_FIRE
                }
            }],
            [CONSTS.EQUIPMENT_SLOT_FINGER_RIGHT]: [{
                type: CONSTS.PROPERTY_DAMAGE_RESISTANCE,
                amp: 0,
                data: {
                    damageType: CONSTS.DAMAGE_TYPE_FIRE
                }
            }]
        })
    })
})