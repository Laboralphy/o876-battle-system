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
            proficiency: CONSTS.PROFICIENCY_WEAPON_SIMPLE,
            damages: '1d6',
            damageType: CONSTS.DAMAGE_TYPE_PIERCING,
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
            proficiency: CONSTS.PROFICIENCY_WEAPON_SIMPLE,
            damages: '1d6',
            damageType: CONSTS.DAMAGE_TYPE_PIERCING,
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
                proficiency: CONSTS.PROFICIENCY_WEAPON_SIMPLE,
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
                proficiency: CONSTS.PROFICIENCY_WEAPON_SIMPLE,
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
            proficiency: CONSTS.PROFICIENCY_WEAPON_SIMPLE,
            damages: '1d6',
            damageType: CONSTS.DAMAGE_TYPE_PIERCING,
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
            proficiency: CONSTS.PROFICIENCY_WEAPON_SIMPLE,
            damages: '1d6',
            damageType: CONSTS.DAMAGE_TYPE_PIERCING,
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
                proficiency: CONSTS.PROFICIENCY_ARMOR_LIGHT,
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
            proficiency: CONSTS.PROFICIENCY_WEAPON_SIMPLE,
            damages: '1d6',
            damageType: CONSTS.DAMAGE_TYPE_PIERCING,
            attributes: [CONSTS.WEAPON_ATTRIBUTE_FINESSE],
            size: CONSTS.WEAPON_SIZE_SMALL,
            weight: 2,
            properties: [],
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]
        })).not.toThrow()
        expect(() => ib.defineBlueprint('shortsword', {
            entityType: CONSTS.ENTITY_TYPE_ITEM,
            itemType: CONSTS.ITEM_TYPE_WEAPON,
            proficiency: CONSTS.PROFICIENCY_WEAPON_MARTIAL,
            damages: '2d6',
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
            proficiency: CONSTS.PROFICIENCY_WEAPON_SIMPLE,
            damages: '1d6',
            damageType: CONSTS.DAMAGE_TYPE_PIERCING,
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
            proficiency: CONSTS.PROFICIENCY_WEAPON_MARTIAL,
            damages: '1d8',
            damageType: CONSTS.DAMAGE_TYPE_PIERCING,
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
            proficiency: CONSTS.PROFICIENCY_WEAPON_SIMPLE,
            damages: '1d6',
            damageType: CONSTS.DAMAGE_TYPE_PIERCING,
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
            proficiency: CONSTS.PROFICIENCY_WEAPON_SIMPLE,
            damages: '1d6',
            damageType: CONSTS.DAMAGE_TYPE_PIERCING,
            attributes: [CONSTS.WEAPON_ATTRIBUTE_FINESSE],
            size: CONSTS.WEAPON_SIZE_SMALL,
            weight: 6,
            properties: [],
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]
        })
        eb.defineBlueprint('cursed-weapon', {
            properties: [{
                type: CONSTS.PROPERTY_ATTACK_MODIFIER,
                amp: -1,
                attackType: CONSTS.ATTACK_TYPE_MELEE
            }, {
                type: CONSTS.PROPERTY_CURSED
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
                data: {
                    attackType: 'ATTACK_TYPE_MELEE'
                }
            },
            { type: CONSTS.PROPERTY_CURSED, amp: 0, data: {} },
            {
                type: 'PROPERTY_DAMAGE_MODIFIER',
                amp: 1,
                data: {
                    damageType: 'DAMAGE_TYPE_FIRE'
                }
            }
        ])
    })
    it('should create a valid creature when using a composition of 3 partial blueprints linked by "extends" references', function () {
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
    })
    it('should not create several blueprint when creating several entities from a blueprint objet instead of resref', function () {
        const ib = new EntityBuilder()
        ib.schemaValidator = oSchemaValidator
        const oShorSwordBP = {
            entityType: CONSTS.ENTITY_TYPE_ITEM,
            itemType: CONSTS.ITEM_TYPE_WEAPON,
            proficiency: CONSTS.PROFICIENCY_WEAPON_SIMPLE,
            damages: '1d6',
            damageType: CONSTS.DAMAGE_TYPE_PIERCING,
            attributes: [CONSTS.WEAPON_ATTRIBUTE_FINESSE],
            size: CONSTS.WEAPON_SIZE_SMALL,
            weight: 2,
            properties: [],
            equipmentSlots: [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]
        }
        expect(Object.values(ib.blueprints).length).toBe(0)
        const s1 = ib.createEntity(oShorSwordBP, 's1')
        expect(Object.values(ib.blueprints).length).toBe(1)
        const s2 = ib.createEntity(oShorSwordBP, 's2')
        expect(Object.values(ib.blueprints).length).toBe(1)
        const s3 = ib.createEntity(oShorSwordBP, 's3')
        expect(Object.values(ib.blueprints).length).toBe(1)
        const sShortSwordBPRef = Object.keys(ib.blueprints)[0]
        expect(sShortSwordBPRef).toBe(s1.blueprint.ref)
        expect(sShortSwordBPRef).toBe(s2.blueprint.ref)
        expect(sShortSwordBPRef).toBe(s3.blueprint.ref)
    })
})

describe('building a monster', function () {
    it('should build a monster with natural weapon that inflict poison damage', function () {
        const bpSnake = {
            "entityType": "ENTITY_TYPE_ACTOR",
            "classType": "CLASS_TYPE_MONSTER",
            "proficiencies": [
                "PROFICIENCY_WEAPON_NATURAL"
            ],
            "specie": "SPECIE_ABERRATION",
            "ac": 4,
            "hd": 10,
            "level": 3,
            "speed": 35,
            "equipment": [
                {
                    "entityType": "ENTITY_TYPE_ITEM",
                    "itemType": "ITEM_TYPE_WEAPON",
                    "weight": 0,
                    "size": "WEAPON_SIZE_MEDIUM",
                    "attributes": [],
                    "damages": "1d6",
                    "damageType": "DAMAGE_TYPE_PIERCING",
                    "proficiency": "PROFICIENCY_WEAPON_NATURAL",
                    "properties": [
                        {
                            "type": "PROPERTY_DAMAGE_MODIFIER",
                            "amp": "1d4",
                            "damageType": "DAMAGE_TYPE_FIRE"
                        }
                    ],
                    "equipmentSlots": [
                        "EQUIPMENT_SLOT_WEAPON_MELEE"
                    ]
                }
            ],
            "properties": [
                {
                    "type": "PROPERTY_DAMAGE_REDUCTION",
                    "amp": 4,
                    "damageType": "DAMAGE_TYPE_FIRE"
                }
            ],
            "actions": [
                {
                    "id": "act-test-action",
                    "actionType": "COMBAT_ACTION_TYPE_SPELL_LIKE_ABILITY",
                    "onHit": "at-been-hit",
                    "range": 25,
                    "parameters": {
                        "oneParam": "oneValue"
                    },
                    "cooldown": 6,
                    "charges": 5
                }
            ]
        }
        const ib = new EntityBuilder()
        ib.schemaValidator = oSchemaValidator
        const snake = ib.createEntity(bpSnake)
        expect(snake).toBeDefined()
        expect(snake).toBeInstanceOf(Creature)
        expect(snake.getters.getEquipment[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE].properties[0]).toEqual({
            type: CONSTS.PROPERTY_DAMAGE_MODIFIER,
            amp: '1d4',
            data: {
                damageType: CONSTS.DAMAGE_TYPE_FIRE
            }
        })
    })
})

describe('create a complex monster', function () {
    const bpMonster = {
        "entityType": "ENTITY_TYPE_ACTOR",
        "classType": "CLASS_TYPE_MONSTER",
        "proficiencies": [
            "PROFICIENCY_WEAPON_NATURAL"
        ],
        "specie": "SPECIE_ABERRATION",
        "ac": 4,
        "hd": 10,
        "level": 3,
        "speed": 35,
        "abilities": {
            "strength": 10,
            "dexterity": 10,
            "constitution": 10,
            "intelligence": 10,
            "wisdom": 10,
            "charisma": 10
        },
        "equipment": [
            {
                "entityType": "ENTITY_TYPE_ITEM",
                "itemType": "ITEM_TYPE_WEAPON",
                "proficiency": "PROFICIENCY_WEAPON_NATURAL",
                "weight": 0,
                "size": "WEAPON_SIZE_MEDIUM",
                "attributes": [],
                "damages": "1d6",
                "damageType": "DAMAGE_TYPE_PIERCING",
                "properties": [
                    {
                        "type": "PROPERTY_DAMAGE_MODIFIER",
                        "amp": "1d4",
                        "damageType": "DAMAGE_TYPE_FIRE"
                    }
                ],
                "equipmentSlots": [
                    "EQUIPMENT_SLOT_WEAPON_MELEE"
                ]
            },
            {
                "entityType": "ENTITY_TYPE_ITEM",
                "itemType": "ITEM_TYPE_WEAPON",
                "proficiency": "PROFICIENCY_WEAPON_NATURAL",
                "weight": 0,
                "size": "WEAPON_SIZE_MEDIUM",
                "attributes": [
                    "WEAPON_ATTRIBUTE_RANGED"
                ],
                "damages": "1d6",
                "damageType": "DAMAGE_TYPE_PIERCING",
                "properties": [],
                "equipmentSlots": [
                    "EQUIPMENT_SLOT_WEAPON_RANGED"
                ]
            }
        ],
        "properties": [
            {
                "type": "PROPERTY_DAMAGE_REDUCTION",
                "amp": 4,
                "damageType": "DAMAGE_TYPE_FIRE"
            }
        ],
        "actions": [
            {
                "id": "act-test-action",
                "actionType": "COMBAT_ACTION_TYPE_SPELL_LIKE_ABILITY",
                "onHit": "at-been-hit",
                "range": 25,
                "parameters": {
                    "oneParam": "oneValue"
                },
                "cooldown": 6,
                "charges": 5
            }
        ]
    }
    it('should not throw error when creating this monster', function () {
        const ib = new EntityBuilder()
        ib.schemaValidator = oSchemaValidator
        let monster
        expect(() => {
            monster = ib.createEntity(bpMonster)
        }).not.toThrow()
        expect(monster.getters.getMaxHitPoints).toBe(16)
        expect(monster.getters.getAbilities).toEqual({
            "ABILITY_STRENGTH": 10,
            "ABILITY_DEXTERITY": 10,
            "ABILITY_CONSTITUTION": 10,
            "ABILITY_INTELLIGENCE": 10,
            "ABILITY_WISDOM": 10,
            "ABILITY_CHARISMA": 10
        })
    })
})

describe('extends again, see if base monster is properly extended', function () {
    const bpSkeletonBase = {
        "entityType": "ENTITY_TYPE_ACTOR",
        "classType": "CLASS_TYPE_MONSTER",
        "proficiencies": [
            "PROFICIENCY_WEAPON_NATURAL",
            "PROFICIENCY_WEAPON_SIMPLE",
            "PROFICIENCY_WEAPON_MARTIAL",
            "PROFICIENCY_ARMOR_LIGHT",
            "PROFICIENCY_ARMOR_MEDIUM",
            "PROFICIENCY_ARMOR_HEAVY"
        ],
        "abilities": {
            "strength": 10,
            "dexterity": 14,
            "constitution": 15,
            "intelligence": 6,
            "wisdom": 8,
            "charisma": 5
        },
        "equipment": [],
        "properties": [
            {
                "type": "PROPERTY_DAMAGE_VULNERABILITY",
                "amp": 0,
                "damageType": "DAMAGE_TYPE_CRUSHING"
            },
            {
                "type": "PROPERTY_DAMAGE_IMMUNITY",
                "amp": 0,
                "damageType": "DAMAGE_TYPE_POISON"
            },
            {
                "type": "PROPERTY_DAMAGE_IMMUNITY",
                "amp": 0,
                "damageType": "DAMAGE_TYPE_POISON"
            },
            {
                "type": "PROPERTY_DARKVISION",
                "amp": 0
            }
        ],
        "actions": [],
        "specie": "SPECIE_UNDEAD",
        "ac": 0,
        "level": 2,
        "hd": 8,
        "speed": 30
    }
    const bpSkeleton = {
        "entityType": "ENTITY_TYPE_ACTOR",
        "classType": "CLASS_TYPE_MONSTER",
        "proficiencies": [
            "PROFICIENCY_WEAPON_NATURAL",
            "PROFICIENCY_WEAPON_SIMPLE",
            "PROFICIENCY_WEAPON_MARTIAL",
            "PROFICIENCY_ARMOR_LIGHT",
            "PROFICIENCY_ARMOR_MEDIUM",
            "PROFICIENCY_ARMOR_HEAVY"
        ],
        "abilities": {},
        "equipment": [
        ],
        "properties": [],
        "actions": [],
        "extends": [
            "c-base-skeleton"
        ]
    }
    it ('should build a complete monster', function () {
        const eb = new EntityBuilder()
        eb.schemaValidator = oSchemaValidator
        eb.blueprints = {
            'c-base-skeleton': bpSkeletonBase,
            'c-skeleton': bpSkeleton
        }
        let monster
        expect(() => {
            monster = eb.createEntity('c-skeleton')
        }).not.toThrow()
        expect(monster.getters.getMaxHitPoints).toBe(9)
        expect(monster.getters.getAbilities[CONSTS.ABILITY_DEXTERITY]).toBe(14)
    })
})