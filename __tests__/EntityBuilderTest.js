const EntityBuilder = require('../src/EntityBuilder')
const SCHEMA = require('../src/schemas')
const SchemaValidator = require('../src/SchemaValidator')
const CONSTS = require('../src/consts')
const Creature = require('../src/Creature')

const oSchemaValidator = new SchemaValidator()
oSchemaValidator.schemaIndex = SCHEMA
oSchemaValidator.init()

describe('defineBlueprint', function () {
    it('item builder "blueprints" property should have new property when using defineBlueprint', function () {
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
    it('should not keep original blueprint but copy blueprint with additional property when defining blueprint', function () {
        const ib = new EntityBuilder()
        ib.schemaValidator = oSchemaValidator
        const oOriginalBlueprint = {
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
        }
        ib.defineBlueprint('shortsword', oOriginalBlueprint)
        expect(ib.blueprints.shortsword).not.toBe(oOriginalBlueprint)
        expect(ib.blueprints.shortsword).toHaveProperty('ref')
    })
    it('should throw an error when weapon blueprint is missing some required property', function () {
        const ib = new EntityBuilder()
        ib.schemaValidator = oSchemaValidator
        expect(() => {
            ib.defineBlueprint('shortsword', {
                entityType: CONSTS.ENTITY_TYPE_ITEM,
                itemType: CONSTS.ITEM_TYPE_WEAPON,
                proficiencies: [CONSTS.PROFICIENCY_WEAPON_SIMPLE],
                damageTypes: [CONSTS.DAMAGE_TYPE_PIERCING],
                attributes: [CONSTS.WEAPON_ATTRIBUTE_FINESSE],
                size: CONSTS.WEAPON_SIZE_SMALL,
                weight: 2,
                properties: [],
                equipmentSlots: [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]
            })
        }).toThrow()
    })
    it('should throw an error when weapon blueprint has incorrect or mistyped property', function () {
        const ib = new EntityBuilder()
        ib.schemaValidator = oSchemaValidator
        expect(() => {
            ib.defineBlueprint('shortsword', {
                entityType: CONSTS.ENTITY_TYPE_ITEM,
                itemType: CONSTS.ITEM_TYPE_WEAPON,
                proficiencies: [CONSTS.PROFICIENCY_WEAPON_SIMPLE],
                damageTypes: [CONSTS.DAMAGE_TYPE_PIERCING],
                attributesXXXXXXXXXX: [CONSTS.WEAPON_ATTRIBUTE_FINESSE], // <-- XXXXXXX typo here
                size: CONSTS.WEAPON_SIZE_SMALL,
                damages: '1d6',
                weight: 2,
                properties: [],
                equipmentSlots: [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]
            })
        }).toThrow()
        expect(() => {
            ib.defineBlueprint('shortsword', {
                entityType: CONSTS.ENTITY_TYPE_ITEM,
                itemType: CONSTS.ITEM_TYPE_WEAPON,
                proficiencies: { 'PROFICIENCY_WEAPON_SIMPLE': true }, // <--- type mismatch
                damageTypes: [CONSTS.DAMAGE_TYPE_PIERCING],
                attributes: [CONSTS.WEAPON_ATTRIBUTE_FINESSE],
                size: CONSTS.WEAPON_SIZE_SMALL,
                damages: '1d6',
                weight: 2,
                properties: [],
                equipmentSlots: [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]
            })
        }).toThrow()
    })

    it('should define wpn-shortsword as a complete blueprint when using "extends" of a previously defined blueprint', function () {
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
    it('should not throw when defining blueprint with itemType ITEM_TYPE_ARMOR', function () {
        const eb = new EntityBuilder()
        eb.schemaValidator = oSchemaValidator
        expect(() =>
            eb.defineBlueprint('light-armor', {
                entityType: CONSTS.ENTITY_TYPE_ITEM,
                itemType: CONSTS.ITEM_TYPE_ARMOR,
                proficiencies: [CONSTS.PROFICIENCY_ARMOR_LIGHT],
                ac: 2,
                weight: 20,
                properties: [],
                equipmentSlots: [CONSTS.EQUIPMENT_SLOT_CHEST]
            })
        ).not.toThrow()
    })
    it('should throw an error when redefining a blueprint with an id already defined', function () {
        const ib = new EntityBuilder()
        ib.schemaValidator = oSchemaValidator
        expect(() => ib.defineBlueprint('shortsword', {
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
        })).not.toThrow()
        expect(() => ib.defineBlueprint('shortsword', {
            entityType: CONSTS.ENTITY_TYPE_ITEM,
            itemType: CONSTS.ITEM_TYPE_WEAPON,
            proficiencies: [CONSTS.PROFICIENCY_WEAPON_MARTIAL],
            damages: '2d6',
            damageTypes: [CONSTS.DAMAGE_TYPE_PIERCING],
            attributes: [],
            size: CONSTS.WEAPON_SIZE_MEDIUM,
            weight: 4,
            properties: [],
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]
        })).toThrow(new Error('blueprint shortsword is already defined'))
    })
})

describe('createEntity', function () {
    it('should create an item when blueprint entityType is ENTITY_TYPE_ITEM', function () {
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
        expect(oSword.blueprint.entityType).toBe(CONSTS.ENTITY_TYPE_ITEM)
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
    it('should create an elf fighter when using createEntity after defining several blueprints linked by "extends" references', function () {
        const bpHumanoid = {
            specie: CONSTS.SPECIE_HUMANOID,
            ac: 10,
            hd: 6,
            level: 1,
            classType: CONSTS.CLASS_TYPE_TOURIST,
            speed: 30,
            properties: [],
            actions: [],
            equipment: []
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
            entityType: CONSTS.ENTITY_TYPE_ACTOR,
            extends: ['race-elf', 'class-type-fighter'],
            level: 10,
            abilities: {
                strength: 16,
                dexterity: 14,
                constitution: 16,
                intelligence: 10,
                wisdom: 10,
                charisma: 10
            },
            equipment: []
        }
        const eb = new EntityBuilder()
        eb.schemaValidator = oSchemaValidator
        eb.blueprints = {
            'the-elf': bpMyNPC,
            'race-elf': bpElf,
            'class-type-fighter': bpFighter,
            'specie-humanoid': bpHumanoid
        }
        const mynpc = eb.createEntity('the-elf', 'x1')
        expect(mynpc).toBeInstanceOf(Creature)
        expect(mynpc.getters.getId).toBe('x1')
        expect(mynpc.getters.getSpecie).toBe(CONSTS.SPECIE_HUMANOID)
        expect(mynpc.getters.getRace).toBe(CONSTS.RACE_ELF)
    })
})
