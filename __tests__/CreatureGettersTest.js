const EntityBuilder = require('../src/EntityBuilder')
const SCHEMA = require('../src/schemas')
const SchemaValidator = require('../src/SchemaValidator')
const CONSTS = require('../src/consts')
const Creature = require('../src/Creature')

const oSchemaValidator = new SchemaValidator()
oSchemaValidator.schemaIndex = SCHEMA
oSchemaValidator.init()

const bpNormalActor = {
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

let eb

beforeEach(function () {
    eb = new EntityBuilder()
    eb.schemaValidator = oSchemaValidator
})

afterEach(function () {
    eb = null
})

describe('getAbilities', function () {
    it('should return strength:14 dex:12 con:16, int:10 wis:11 cha:9 when defining creature blueprint with strength = 14 ...', function () {
        const oCreature = eb.createEntity({
            ...bpNormalActor,
            abilities: {
                strength: 14,
                dexterity: 12,
                constitution: 16,
                intelligence: 10,
                wisdom: 11,
                charisma: 9
            }
        })
        expect(oCreature.getters.getAbilities).toEqual({
            [CONSTS.ABILITY_STRENGTH]: 14,
            [CONSTS.ABILITY_DEXTERITY]: 12,
            [CONSTS.ABILITY_CONSTITUTION]: 16,
            [CONSTS.ABILITY_INTELLIGENCE]: 10,
            [CONSTS.ABILITY_WISDOM]: 11,
            [CONSTS.ABILITY_CHARISMA]: 9
        })
    })
    it('should return strength 19 when having strength 17 and equipped with item +2 str', function () {
        const oCreature = eb.createEntity({
            ...bpNormalActor,
            abilities: {
                strength: 17,
                dexterity: 12,
                constitution: 16,
                intelligence: 10,
                wisdom: 11,
                charisma: 9
            }
        })
        const oBelt = eb.createEntity(bpBeltOfOgreStrength)
        oCreature.equipItem(oBelt)
        expect(oCreature.getters.getAbilities[CONSTS.ABILITY_STRENGTH]).toBe(19)
    })
})

describe('getAbilityBaseValues', function () {
    it('should return strength 14 even equipped with belth of ogre strength', function () {
        const oCreature = eb.createEntity({
            ...bpNormalActor,
            abilities: {
                strength: 14,
                dexterity: 12,
                constitution: 16,
                intelligence: 10,
                wisdom: 11,
                charisma: 9
            }
        })
        const oBelt = eb.createEntity(bpBeltOfOgreStrength)
        oCreature.equipItem(oBelt)
        expect(oCreature.getters.getAbilityBaseValues[CONSTS.ABILITY_STRENGTH]).toBe(14)
    })
})

describe('getAbilityModifiers', function () {
    it('should return strength modifier 3 when strength is 16, and 4 with belt of ogre strength', function () {
        const oCreature = eb.createEntity({
            ...bpNormalActor,
            abilities: {
                strength: 16,
                dexterity: 12,
                constitution: 16,
                intelligence: 10,
                wisdom: 11,
                charisma: 9
            }
        })
        expect(oCreature.getters.getAbilityModifiers[CONSTS.ABILITY_STRENGTH]).toBe(3)
        const oBelt = eb.createEntity(bpBeltOfOgreStrength)
        oCreature.equipItem(oBelt)
        expect(oCreature.getters.getAbilityModifiers[CONSTS.ABILITY_STRENGTH]).toBe(4)
    })
})

describe('getArmorClass', function () {
    it('should return when computing human armor class dex 10 equipping no item', function () {
        const oCreature = eb.createEntity({
            ...bpNormalActor,
            abilities: {
                strength: 10,
                dexterity: 10,
                constitution: 16,
                intelligence: 10,
                wisdom: 10,
                charisma: 10
            }
        })
        expect(oCreature.getters.getArmorClass).toEqual({
            [CONSTS.ATTACK_TYPE_RANGED]: 10,
            [CONSTS.ATTACK_TYPE_RANGED_TOUCH]: 10,
            [CONSTS.ATTACK_TYPE_MELEE]: 10,
            [CONSTS.ATTACK_TYPE_MELEE_TOUCH]: 10
        })
    })
})

describe('getSlotProperties', function () {
    it('should return empty object when no items are equipped', function () {
        const oCreature = eb.createEntity({
            ...bpNormalActor
        })
        expect(oCreature.getters.getSlotProperties).toEqual({
        })
    })
    it('should return empty object when simple items with no properties are equipped', function () {
        const oArmor = eb.createEntity({
            entityType: CONSTS.ENTITY_TYPE_ITEM,
            itemType: CONSTS.ITEM_TYPE_ARMOR,
            ac: 1,
            proficiency: CONSTS.PROFICIENCY_ARMOR_LIGHT,
            properties: [],
            weight: 10,
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_CHEST]
        })
        const oOrnateRing = eb.createEntity({
            entityType: CONSTS.ENTITY_TYPE_ITEM,
            itemType: CONSTS.ITEM_TYPE_RING,
            ac: 0,
            proficiency: '',
            properties: [],
            weight: 0.1,
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_FINGER_RIGHT, CONSTS.EQUIPMENT_SLOT_FINGER_LEFT]
        })
        const oCreature = eb.createEntity({
            ...bpNormalActor
        })
        oCreature.equipItem(oArmor)
        oCreature.equipItem(oOrnateRing)
        expect(oCreature.getters.getSlotProperties).toEqual({
        })
    })
    it('should return a built property with AC bonus when creature is equipped with armor', function () {
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
            ...bpNormalActor
        })
        expect(oCreature.getters.getSlotProperties).toEqual({})
        oCreature.equipItem(oArmor)
        expect(oCreature.getters.getSlotProperties).toEqual({})
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
    it('should list several item properties when equipping an item with several properties', function () {
        const oMagicArmor = eb.createEntity({
            entityType: CONSTS.ENTITY_TYPE_ITEM,
            itemType: CONSTS.ITEM_TYPE_ARMOR,
            ac: 1,
            proficiency: CONSTS.PROFICIENCY_ARMOR_LIGHT,
            properties: [{
                type: CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER,
                amp: 1
            }, {
                type: CONSTS.PROPERTY_DAMAGE_RESISTANCE,
                damageType: CONSTS.DAMAGE_TYPE_COLD
            }],
            weight: 10,
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_CHEST]
        })
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
        const oCreature = eb.createEntity({
            ...bpNormalActor
        })
        oCreature.equipItem(oMagicArmor)
        oCreature.equipItem(oRingOfFireProtection)
        expect(oCreature.getters.getSlotProperties).toEqual({
            [CONSTS.EQUIPMENT_SLOT_CHEST]: [{
                type: CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER,
                amp: 1,
                data: {
                    damageType: CONSTS.DAMAGE_TYPE_ANY,
                    attackType: CONSTS.ATTACK_TYPE_ANY
                }
            }, {
                type: CONSTS.PROPERTY_DAMAGE_RESISTANCE,
                amp: 0,
                data: {
                    damageType: CONSTS.DAMAGE_TYPE_COLD
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

describe('isWieldingTwoHandedWeapon', function () {
    it('should return false when not equipped with any item', function () {
        const oCreature = eb.createEntity({
            ...bpNormalActor
        })
        expect(oCreature.getters.isWieldingTwoHandedWeapon).toBeFalsy()
    })
    it('should return true when equipped with 2H swords', function () {
        const o2HSword = eb.createEntity({
            entityType: CONSTS.ENTITY_TYPE_ITEM,
            itemType: CONSTS.ITEM_TYPE_WEAPON,
            damages: '1d12',
            damageTypes: [CONSTS.DAMAGE_TYPE_SLASHING],
            size: CONSTS.WEAPON_SIZE_LARGE,
            weight: 5,
            proficiency: CONSTS.PROFICIENCY_WEAPON_MARTIAL,
            properties: [],
            attributes: [CONSTS.WEAPON_ATTRIBUTE_TWO_HANDED],
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]
        })
        const o1HSword = eb.createEntity({
            entityType: CONSTS.ENTITY_TYPE_ITEM,
            itemType: CONSTS.ITEM_TYPE_WEAPON,
            damages: '1d8',
            damageTypes: [CONSTS.DAMAGE_TYPE_SLASHING],
            size: CONSTS.WEAPON_SIZE_LARGE,
            proficiency: CONSTS.PROFICIENCY_WEAPON_MARTIAL,
            weight: 3,
            properties: [],
            attributes: [],
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]
        })
        const oCreature = eb.createEntity({
            ...bpNormalActor
        })
        oCreature.equipItem(o1HSword)
        expect(oCreature.getters.isWieldingTwoHandedWeapon).toBeFalsy()
        oCreature.equipItem(o2HSword)
        expect(oCreature.getters.isWieldingTwoHandedWeapon).toBeTruthy()
        oCreature.equipItem(o1HSword)
        expect(oCreature.getters.isWieldingTwoHandedWeapon).toBeFalsy()
    })
})