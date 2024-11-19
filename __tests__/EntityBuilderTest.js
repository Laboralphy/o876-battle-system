const EntityBuilder = require('../src/EntityBuilder')
const SCHEMA = require('../src/schemas')
const SchemaValidator = require('../src/SchemaValidator')
const CONSTS = require('../src/consts')

const oSchemaValidator = new SchemaValidator()
oSchemaValidator.schemaIndex = SCHEMA
oSchemaValidator.init()

describe('defineBlueprint', function () {
    it('define a weapon blueprint', function () {
        const ib = new EntityBuilder()
        ib.schemaValidator = oSchemaValidator
        ib.defineBlueprint('shortsword', {
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
        expect(ib.blueprints).toHaveProperty('shortsword')
    })
    it('define a weapon blueprint with an extends', function () {
        const eb = new EntityBuilder()
        eb.schemaValidator = oSchemaValidator
        eb.defineBlueprint('weapon-type-shortsword', {
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
        eb.defineBlueprint('wpn-shortsword', {
            extends: 'weapon-type-shortsword'
        })
        expect(eb.blueprints['wpn-shortsword']).toEqual({
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
        const eb = new EntityBuilder()
        eb.schemaValidator = oSchemaValidator
        eb.defineBlueprint('light-armor', {
            entityType: CONSTS.ENTITY_TYPE_ITEM,
            itemType: CONSTS.ITEM_TYPE_ARMOR,
            proficiencies: [CONSTS.PROFICIENCY_ARMOR_LIGHT],
            ac: 2,
            weight: 20,
            properties: [],
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_CHEST]
        })
    })
})

describe('createItem', function () {
    it('create a sword', function () {
        const eb = new EntityBuilder()
        eb.schemaValidator = oSchemaValidator
        eb.defineBlueprint('weapon-type-shortsword', {
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
        const oSword = eb.createEntity('weapon-type-shortsword', 'x1')
        expect(oSword.blueprint.ref).toBe('weapon-type-shortsword')
    })
    it('create a sword from a blueprint without prior define it', function () {
        const eb = new EntityBuilder()
        eb.schemaValidator = oSchemaValidator
        const bp = {
            entityType: CONSTS.ENTITY_TYPE_ITEM,
            itemType: CONSTS.ITEM_TYPE_WEAPON,
            proficiencies: [CONSTS.PROFICIENCY_WEAPON_MARTIAL],
            damages: '1d8',
            damageTypes: [CONSTS.DAMAGE_TYPE_SLASHING],
            attributes: [],
            size: CONSTS.WEAPON_SIZE_MEDIUM,
            weight: 6,
            properties: [],
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]
        }
        const oSword = eb.createEntity(bp, 'x1')
        expect(oSword.blueprint.damages).toBe('1d8')
    })
    it('create a sword with a couple of blueprint', function () {
        const eb = new EntityBuilder()
        eb.schemaValidator = oSchemaValidator
        eb.defineBlueprint('weapon-type-shortsword', {
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
        eb.defineBlueprint('weapon-magic-sword', {
            extends: 'weapon-type-shortsword',
            damages: '1d6+1',
            properties: [{
                type: 'PROPERTY_ATTACK_MODIFIER',
                amp: 1,
                attackType: CONSTS.ATTACK_TYPE_MELEE
            }]
        })
        const oSword = eb.createEntity('weapon-magic-sword', 'x1')
        expect(oSword.blueprint.damages).toBe('1d6+1')
    })
    it('create a sword with a several ancestors blueprints', function () {
        const eb = new EntityBuilder()
        eb.schemaValidator = oSchemaValidator
        eb.defineBlueprint('weapon-type-shortsword', {
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
        eb.defineBlueprint('cursed-weapon', {
            properties: [{
                type: 'PROPERTY_ATTACK_MODIFIER',
                amp: -1,
                attackType: CONSTS.ATTACK_TYPE_MELEE
            }, {
                type: 'PROPERTY_CURSE'
            }]
        })
        eb.defineBlueprint('weapon-cursed-sword-of-fire', {
            extends: ['weapon-type-shortsword', 'cursed-weapon'],
            properties: [{
                type: 'PROPERTY_DAMAGE_MODIFIER',
                amp: 1,
                damageType: CONSTS.DAMAGE_TYPE_FIRE
            }],
            damages: '1d6-1'
        })
        const oSword = eb.createEntity('weapon-cursed-sword-of-fire', 'x1')
        expect(oSword.blueprint.damages).toBe('1d6-1')
        expect(oSword.properties).toEqual([
            {
                type: 'PROPERTY_ATTACK_MODIFIER',
                amp: -1,
                attackType: 'ATTACK_TYPE_MELEE'
            },
            { type: 'PROPERTY_CURSE' },
            {
                type: 'PROPERTY_DAMAGE_MODIFIER',
                amp: 1,
                damageType: 'DAMAGE_TYPE_FIRE'
            }
        ])
    })
})

describe('createCreature', function () {
    it ('should create an elf fighter', function () {
        const bpHumanoid = {
            entityType: CONSTS.ENTITY_TYPE_ACTOR,
            specie: CONSTS.SPECIE_HUMANOID,
            ac: 10,
            speed: 30,
            properties: []
        }
        const bpElf = {
            extends: 'specie-humanoid',
            race: CONSTS.RACE_ELF
        }
        const bpFighter = {
            hd: 10,
            proficiencies: [
                "PROFICIENCY_ARMOR_HEAVY",
                "PROFICIENCY_ARMOR_MEDIUM",
                "PROFICIENCY_ARMOR_LIGHT",
                "PROFICIENCY_WEAPON_MARTIAL",
                "PROFICIENCY_WEAPON_SIMPLE",
                "PROFICIENCY_SAVING_THROW_STRENGTH",
                "PROFICIENCY_SAVING_THROW_CONSTITUTION"
            ],
            actions: []
        }
        const bpMyNPC = {
            extends: ['race-elf', 'class-type-fighter'],
            abilities: {
                strength: 16,
                dexterity: 14,
                constitution: 16,
                intelligence: 10,
                wisdom: 10,
                charisma: 10
            },
            equipment: {}
        }
        const eb = new EntityBuilder()
        eb.schemaValidator = oSchemaValidator
        eb.blueprints = {
            'the-elf': bpMyNPC,
            'race-elf': bpElf,
            'class-type-fighter': bpFighter,
            'specie-humanoid': bpHumanoid
        }
        console.log(eb.blueprints)
        const mynpc = eb.createEntity('the-elf', 'x1')
        console.log(mynpc)
    })
})
