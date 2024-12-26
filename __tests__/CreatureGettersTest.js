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
    ac: 0,
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

const bpStuddedLeatherArmor = {
    entityType: CONSTS.ENTITY_TYPE_ITEM,
    itemType: CONSTS.ITEM_TYPE_ARMOR,
    properties: [],
    ac: 2,
    weight: 5,
    equipmentSlots: [CONSTS.EQUIPMENT_SLOT_CHEST],
    proficiency: CONSTS.PROFICIENCY_ARMOR_LIGHT
}

const bpPlateArmor = {
    entityType: CONSTS.ENTITY_TYPE_ITEM,
    itemType: CONSTS.ITEM_TYPE_ARMOR,
    properties: [{
        type: CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER,
        amp: 2,
        damageType: CONSTS.DAMAGE_TYPE_SLASHING
    }],
    ac: 6,
    weight: 40,
    equipmentSlots: [CONSTS.EQUIPMENT_SLOT_CHEST],
    proficiency: CONSTS.PROFICIENCY_ARMOR_HEAVY
}

const bpDagger = {
    entityType: CONSTS.ENTITY_TYPE_ITEM,
    itemType: CONSTS.ITEM_TYPE_WEAPON,
    damages: '1d4',
    damageType: CONSTS.DAMAGE_TYPE_PIERCING,
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
    damageType: CONSTS.DAMAGE_TYPE_PIERCING,
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
    damageType: CONSTS.DAMAGE_TYPE_PIERCING,
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
    damageType: CONSTS.DAMAGE_TYPE_SLASHING,
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
    it('should return 10 to all AC when computing human armor class dex 10 equipping no item', function () {
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
            [CONSTS.ATTACK_TYPE_MELEE_TOUCH]: 10,
            [CONSTS.DAMAGE_TYPE_SLASHING]: 0,
            [CONSTS.DAMAGE_TYPE_CRUSHING]: 0,
            [CONSTS.DAMAGE_TYPE_PIERCING]: 0
        })
    })
    it('should return 12 to all AC when computing human armor class dex 14 equipping no item', function () {
        const oCreature = eb.createEntity({
            ...bpNormalActor,
            abilities: {
                strength: 10,
                dexterity: 14,
                constitution: 16,
                intelligence: 10,
                wisdom: 10,
                charisma: 10
            }
        })
        expect(oCreature.getters.getArmorClass).toEqual({
            [CONSTS.ATTACK_TYPE_RANGED]: 12,
            [CONSTS.ATTACK_TYPE_RANGED_TOUCH]: 12,
            [CONSTS.ATTACK_TYPE_MELEE]: 12,
            [CONSTS.ATTACK_TYPE_MELEE_TOUCH]: 12,
            [CONSTS.DAMAGE_TYPE_SLASHING]: 0,
            [CONSTS.DAMAGE_TYPE_CRUSHING]: 0,
            [CONSTS.DAMAGE_TYPE_PIERCING]: 0
        })
    })
    it('should return 14 to AC and 12 to touch AC when computing human armor class dex 14 equipping an armor', function () {
        const oCreature = eb.createEntity({
            ...bpNormalActor,
            abilities: {
                strength: 10,
                dexterity: 14,
                constitution: 16,
                intelligence: 10,
                wisdom: 10,
                charisma: 10
            }
        })
        const oArmor = eb.createEntity(bpStuddedLeatherArmor)
        oCreature.equipItem(oArmor)
        expect(oCreature.getters.getArmorClass).toEqual({
            [CONSTS.ATTACK_TYPE_RANGED]: 14,
            [CONSTS.ATTACK_TYPE_RANGED_TOUCH]: 12,
            [CONSTS.ATTACK_TYPE_MELEE]: 14,
            [CONSTS.ATTACK_TYPE_MELEE_TOUCH]: 12,
            [CONSTS.DAMAGE_TYPE_SLASHING]: 0,
            [CONSTS.DAMAGE_TYPE_CRUSHING]: 0,
            [CONSTS.DAMAGE_TYPE_PIERCING]: 0
        })
    })
    it('should return 16 to AC and 12 to touch AC when computing human armor class dex 14 equipping a magic armor', function () {
        const oCreature = eb.createEntity({
            ...bpNormalActor,
            abilities: {
                strength: 10,
                dexterity: 14,
                constitution: 16,
                intelligence: 10,
                wisdom: 10,
                charisma: 10
            }
        })
        const oMagicArmor = eb.createEntity({
            ...bpStuddedLeatherArmor,
            properties: [{
                type: CONSTS.PROPERTY_ARMOR_CLASS_MODIFIER,
                amp: 2
            }]
        })
        oCreature.equipItem(oMagicArmor)
        expect(oCreature.getters.getArmorClass).toEqual({
            [CONSTS.ATTACK_TYPE_RANGED]: 16,
            [CONSTS.ATTACK_TYPE_RANGED_TOUCH]: 12,
            [CONSTS.ATTACK_TYPE_MELEE]: 16,
            [CONSTS.ATTACK_TYPE_MELEE_TOUCH]: 12,
            [CONSTS.DAMAGE_TYPE_PIERCING]: 0,
            [CONSTS.DAMAGE_TYPE_CRUSHING]: 0,
            [CONSTS.DAMAGE_TYPE_SLASHING]: 0
        })
    })
    it('should return armor class 16 melee +2 against slashing when equipping armor heavy', function () {
        const oCreature = eb.createEntity({
            ...bpNormalActor,
            abilities: {
                strength: 10,
                dexterity: 10,
                constitution: 10,
                intelligence: 10,
                wisdom: 10,
                charisma: 10
            }
        })
        const oPlateArmor = eb.createEntity(bpPlateArmor)
        oCreature.equipItem(oPlateArmor)
        expect(oCreature.getters.getArmorClass).toEqual({
            [CONSTS.ATTACK_TYPE_RANGED]: 16,
            [CONSTS.ATTACK_TYPE_RANGED_TOUCH]: 10,
            [CONSTS.ATTACK_TYPE_MELEE]: 16,
            [CONSTS.ATTACK_TYPE_MELEE_TOUCH]: 10,
            [CONSTS.DAMAGE_TYPE_PIERCING]: 0,
            [CONSTS.DAMAGE_TYPE_CRUSHING]: 0,
            [CONSTS.DAMAGE_TYPE_SLASHING]: 2
        })
    })
})

describe('getRangedAttackBonus', function () {
    describe('when creature is level 5 and dexterity 10', function () {
        describe('when non proficient', function () {
            it('should returns 0 when creature having no ranged weapon', function () {
                const oCreature = eb.createEntity(bpNormalActor)
                oCreature.mutations.setLevel({ value: 5 })
                expect(oCreature.getters.getRangedAttackBonus).toBe(0)
            })
            it('should returns 0 when having bow + arrow', function () {
                const oCreature = eb.createEntity(bpNormalActor)
                oCreature.mutations.setLevel({ value: 5 })
                const oBow = eb.createEntity(bpShortbow)
                const oArrow = eb.createEntity(bpArrow)
                oCreature.equipItem(oBow)
                oCreature.equipItem(oArrow)
                expect(oCreature.getters.getRangedAttackBonus).toBe(0)
            })
        })
        describe('when proficient', function () {
            it('should returns 0 when creature having no ranged weapon', function () {
                const oCreature = eb.createEntity(bpNormalActor)
                oCreature.mutations.addProficiency({ value: CONSTS.PROFICIENCY_WEAPON_SIMPLE })
                oCreature.mutations.setLevel({ value: 5 })
                expect(oCreature.getters.getRangedAttackBonus).toBe(0)
            })
            it('should returns 3 when having bow + arrow', function () {
                const oCreature = eb.createEntity(bpNormalActor)
                oCreature.mutations.addProficiency({ value: CONSTS.PROFICIENCY_WEAPON_SIMPLE })
                oCreature.mutations.setLevel({ value: 5 })
                const oBow = eb.createEntity(bpShortbow)
                const oArrow = eb.createEntity(bpArrow)
                oCreature.equipItem(oBow)
                oCreature.equipItem(oArrow)
                expect(oCreature.getters.isRangedWeaponLoaded).toBeTruthy()
                expect(oCreature.getters.getRangedAttackBonus).toBe(3)
            })
            it('should returns 3 when having bow but no arrow', function () {
                const oCreature = eb.createEntity(bpNormalActor)
                oCreature.mutations.addProficiency({ value: CONSTS.PROFICIENCY_WEAPON_SIMPLE })
                oCreature.mutations.setLevel({ value: 5 })
                const oBow = eb.createEntity(bpShortbow)
                oCreature.equipItem(oBow)
                expect(oCreature.getters.isRangedWeaponLoaded).toBeFalsy()
                expect(oCreature.getters.getRangedAttackBonus).toBe(3)
            })
        })
    })
    describe('when creature is level 5 and dexterity is 14', function () {
        describe('when non proficient', function () {
            it('should returns 2 when creature having no ranged weapon', function () {
                const oCreature = eb.createEntity(bpNormalActor)
                oCreature.mutations.setAbilityValue({ ability: CONSTS.ABILITY_DEXTERITY, value: 14 })
                oCreature.mutations.setLevel({ value: 5 })
                expect(oCreature.getters.getRangedAttackBonus).toBe(2)
            })
            it('should returns 2 when having bow + arrow', function () {
                const oCreature = eb.createEntity(bpNormalActor)
                oCreature.mutations.setAbilityValue({ ability: CONSTS.ABILITY_DEXTERITY, value: 14 })
                oCreature.mutations.setLevel({ value: 5 })
                const oBow = eb.createEntity(bpShortbow)
                const oArrow = eb.createEntity(bpArrow)
                oCreature.equipItem(oBow)
                oCreature.equipItem(oArrow)
                expect(oCreature.getters.getRangedAttackBonus).toBe(2)
            })
        })
        describe('when proficient', function () {
            it('should returns 2 when creature having no ranged weapon', function () {
                // Only dexterity counts
                const oCreature = eb.createEntity(bpNormalActor)
                oCreature.mutations.setAbilityValue({ ability: CONSTS.ABILITY_DEXTERITY, value: 14 })
                oCreature.mutations.addProficiency({ value: CONSTS.PROFICIENCY_WEAPON_SIMPLE })
                oCreature.mutations.setLevel({ value: 5 })
                expect(oCreature.getters.getRangedAttackBonus).toBe(2)
            })
            it('should returns 5 when having bow + arrow', function () {
                const oCreature = eb.createEntity(bpNormalActor)
                oCreature.mutations.setAbilityValue({ ability: CONSTS.ABILITY_DEXTERITY, value: 14 })
                oCreature.mutations.addProficiency({ value: CONSTS.PROFICIENCY_WEAPON_SIMPLE })
                oCreature.mutations.setLevel({ value: 5 })
                const oBow = eb.createEntity(bpShortbow)
                const oArrow = eb.createEntity(bpArrow)
                oCreature.equipItem(oBow)
                oCreature.equipItem(oArrow)
                expect(oCreature.getters.isRangedWeaponLoaded).toBeTruthy()
                expect(oCreature.getters.getRangedAttackBonus).toBe(5)
            })
            it('should returns 5 when having bow but no arrow', function () {
                const oCreature = eb.createEntity(bpNormalActor)
                oCreature.mutations.setAbilityValue({ ability: CONSTS.ABILITY_DEXTERITY, value: 14 })
                oCreature.mutations.addProficiency({ value: CONSTS.PROFICIENCY_WEAPON_SIMPLE })
                oCreature.mutations.setLevel({ value: 5 })
                const oBow = eb.createEntity(bpShortbow)
                oCreature.equipItem(oBow)
                expect(oCreature.getters.isRangedWeaponLoaded).toBeFalsy()
                expect(oCreature.getters.getRangedAttackBonus).toBe(5)
            })
        })
    })
    describe('when creature is level 5 and having magic dagger', function () {
        const bpMagicDagger = {
            ...bpDagger,
            properties: [
                {
                    type: CONSTS.PROPERTY_ATTACK_MODIFIER,
                    amp: 1
                }
            ]
        }
        describe('when proficient', function () {
            it('should returns 0 when creature having no ranged weapon', function () {
                const oCreature = eb.createEntity(bpNormalActor)
                oCreature.mutations.addProficiency({ value: CONSTS.PROFICIENCY_WEAPON_SIMPLE })
                oCreature.mutations.setLevel({ value: 5 })
                oCreature.equipItem(eb.createEntity(bpMagicDagger))
                expect(oCreature.getters.getRangedAttackBonus).toBe(0)
            })
            it('should returns 3 when having bow + arrow', function () {
                const oCreature = eb.createEntity(bpNormalActor)
                oCreature.mutations.addProficiency({ value: CONSTS.PROFICIENCY_WEAPON_SIMPLE })
                oCreature.mutations.setLevel({ value: 5 })
                const oBow = eb.createEntity(bpShortbow)
                const oArrow = eb.createEntity(bpArrow)
                oCreature.equipItem(oBow)
                oCreature.equipItem(oArrow)
                oCreature.equipItem(eb.createEntity(bpMagicDagger))
                expect(oCreature.getters.isRangedWeaponLoaded).toBeTruthy()
                expect(oCreature.getters.getRangedAttackBonus).toBe(3)
            })
            it('should returns 3 when having bow but no arrow', function () {
                const oCreature = eb.createEntity(bpNormalActor)
                oCreature.mutations.addProficiency({ value: CONSTS.PROFICIENCY_WEAPON_SIMPLE })
                oCreature.mutations.setLevel({ value: 5 })
                const oBow = eb.createEntity(bpShortbow)
                oCreature.equipItem(oBow)
                oCreature.equipItem(eb.createEntity(bpMagicDagger))
                expect(oCreature.getters.isRangedWeaponLoaded).toBeFalsy()
                expect(oCreature.getters.getRangedAttackBonus).toBe(3)
            })
        })
    })
})

describe('getMeleeAttackBonus', function () {
    describe('when not proficient with simple melee weapon', function () {
        it('should return 0 with no weapon and strength 10', function () {
            const oCreature = eb.createEntity(bpNormalActor)
            oCreature.mutations.setLevel({ value: 5 })
            expect(oCreature.getters.getMeleeAttackBonus).toBe(0)
        })
        it('should return 4 with no weapon and strength 18 and dex 10', function () {
            // testing if bare hand weapon work with high strength
            const oCreature = eb.createEntity(bpNormalActor)
            oCreature.mutations.setLevel({ value: 5 })
            oCreature.mutations.setAbilityValue({ ability: CONSTS.ABILITY_STRENGTH, value: 18 })
            expect(oCreature.getters.getMeleeAttackBonus).toBe(4)
        })
        it('should return 2 with no weapon and strength 12 and dexterity 14', function () {
            // testing if bare hand is really a finesse weapon
            const oCreature = eb.createEntity(bpNormalActor)
            oCreature.mutations.setLevel({ value: 5 })
            oCreature.mutations.setAbilityValue({ ability: CONSTS.ABILITY_STRENGTH, value: 12 })
            oCreature.mutations.setAbilityValue({ ability: CONSTS.ABILITY_STRENGTH, value: 14 })
            expect(oCreature.getters.getMeleeAttackBonus).toBe(2)
        })
    })
    describe('when proficient with simple melee weapons', function () {
        it('should return 5 with short sword (finesse) weapon and strength 14 and dex 10', function () {
            const oCreature = eb.createEntity(bpNormalActor)
            oCreature.mutations.setLevel({ value: 5 })
            oCreature.mutations.setAbilityValue({ ability: CONSTS.ABILITY_STRENGTH, value: 14 })
            oCreature.mutations.addProficiency({ value: CONSTS.PROFICIENCY_WEAPON_SIMPLE })
            oCreature.equipItem(eb.createEntity(bpShortSword))
            expect(oCreature.getters.getMeleeAttackBonus).toBe(5)
        })
        it('should return 7 with short sword (finesse) weapon and strength 14 and dex 18', function () {
            const oCreature = eb.createEntity(bpNormalActor)
            oCreature.mutations.setLevel({ value: 5 })
            oCreature.mutations.setAbilityValue({ ability: CONSTS.ABILITY_STRENGTH, value: 14 })
            oCreature.mutations.setAbilityValue({ ability: CONSTS.ABILITY_STRENGTH, value: 18 })
            oCreature.mutations.addProficiency({ value: CONSTS.PROFICIENCY_WEAPON_SIMPLE })
            oCreature.equipItem(eb.createEntity(bpShortSword))
            expect(oCreature.getters.getMeleeAttackBonus).toBe(7)
        })
    })
})


describe('getCapabilitySet', function () {
    it('should be able to do anything when creature is newly created', function () {
        const oCreature = eb.createEntity(bpNormalActor)
        const capa = oCreature.getters.getCapabilitySet
        expect(capa.has(CONSTS.CAPABILITY_ACT)).toBeTruthy()
        expect(capa.has(CONSTS.CAPABILITY_SEE)).toBeTruthy()
        expect(capa.has(CONSTS.CAPABILITY_CAST_TARGET)).toBeTruthy()
        expect(capa.has(CONSTS.CAPABILITY_CAST_SELF)).toBeTruthy()
        expect(capa.has(CONSTS.CAPABILITY_MOVE)).toBeTruthy()
        expect(capa.has(CONSTS.CAPABILITY_FIGHT)).toBeTruthy()
    })
    it('should not return CAPABILITY_SEE and CAPABILITY_CAST_TARGET when having effect blindness', function () {
        const oCreature = eb.createEntity(bpNormalActor)
        oCreature.mutations.addEffect({
            effect: {
                type: CONSTS.EFFECT_BLINDNESS,
                amp: 0,
                duration: 10,
                data: {}
            }
        })
        const capa = oCreature.getters.getCapabilitySet
        expect(capa.has(CONSTS.CAPABILITY_ACT)).toBeTruthy()
        expect(capa.has(CONSTS.CAPABILITY_SEE)).toBeFalsy()
        expect(capa.has(CONSTS.CAPABILITY_CAST_TARGET)).toBeFalsy()
        expect(capa.has(CONSTS.CAPABILITY_CAST_SELF)).toBeTruthy()
        expect(capa.has(CONSTS.CAPABILITY_MOVE)).toBeTruthy()
        expect(capa.has(CONSTS.CAPABILITY_FIGHT)).toBeTruthy()
    })
    it('should return only CAPABILITY_SEE when having effect paralysis', function () {
        const oCreature = eb.createEntity(bpNormalActor)
        oCreature.mutations.addEffect({
            effect: {
                type: CONSTS.EFFECT_PARALYSIS,
                amp: 0,
                duration: 10,
                data: {}
            }
        })
        const capa = oCreature.getters.getCapabilitySet
        expect(capa.has(CONSTS.CAPABILITY_ACT)).toBeFalsy()
        expect(capa.has(CONSTS.CAPABILITY_SEE)).toBeTruthy()
        expect(capa.has(CONSTS.CAPABILITY_CAST_TARGET)).toBeFalsy()
        expect(capa.has(CONSTS.CAPABILITY_CAST_SELF)).toBeFalsy()
        expect(capa.has(CONSTS.CAPABILITY_MOVE)).toBeFalsy()
        expect(capa.has(CONSTS.CAPABILITY_FIGHT)).toBeFalsy()
    })
    it('should return only CAPABILITY_SEE when having effect stun', function () {
        const oCreature = eb.createEntity(bpNormalActor)
        oCreature.mutations.addEffect({
            effect: {
                type: CONSTS.EFFECT_STUN,
                amp: 0,
                duration: 10,
                data: {}
            }
        })
        const capa = oCreature.getters.getCapabilitySet
        expect(capa.has(CONSTS.CAPABILITY_ACT)).toBeFalsy()
        expect(capa.has(CONSTS.CAPABILITY_SEE)).toBeTruthy()
        expect(capa.has(CONSTS.CAPABILITY_CAST_TARGET)).toBeFalsy()
        expect(capa.has(CONSTS.CAPABILITY_CAST_SELF)).toBeFalsy()
        expect(capa.has(CONSTS.CAPABILITY_MOVE)).toBeFalsy()
        expect(capa.has(CONSTS.CAPABILITY_FIGHT)).toBeFalsy()
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
                    attackType: CONSTS.ATTACK_TYPE_ANY
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
                damageType: CONSTS.DAMAGE_TYPE_THERMAL
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
                damageType: CONSTS.DAMAGE_TYPE_THERMAL
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
                    damageType: CONSTS.DAMAGE_TYPE_THERMAL
                }
            }],
            [CONSTS.EQUIPMENT_SLOT_FINGER_RIGHT]: [{
                type: CONSTS.PROPERTY_DAMAGE_RESISTANCE,
                amp: 0,
                data: {
                    damageType: CONSTS.DAMAGE_TYPE_THERMAL
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
                damageType: CONSTS.DAMAGE_TYPE_THERMAL
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
                damageType: CONSTS.DAMAGE_TYPE_THERMAL
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
                    attackType: CONSTS.ATTACK_TYPE_ANY
                }
            }, {
                type: CONSTS.PROPERTY_DAMAGE_RESISTANCE,
                amp: 0,
                data: {
                    damageType: CONSTS.DAMAGE_TYPE_THERMAL
                }
            }],
            [CONSTS.EQUIPMENT_SLOT_FINGER_RIGHT]: [{
                type: CONSTS.PROPERTY_DAMAGE_RESISTANCE,
                amp: 0,
                data: {
                    damageType: CONSTS.DAMAGE_TYPE_THERMAL
                }
            }]
        })
    })
})

describe('isWieldingProficientWeapon', function () {
    it('should return false when not having weapon and having no proficiency_weapon_natural', function () {
        const oCreature = eb.createEntity(bpNormalActor)
        expect(oCreature.getters.isEquipmentProficient[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]).toBeFalsy()
    })
    it('should return true when not having weapon and having proficiency_weapon_natural', function () {
        const oCreature = eb.createEntity(bpNormalActor)
        oCreature.mutations.addProficiency({ value: CONSTS.PROFICIENCY_WEAPON_NATURAL })
        expect(oCreature.getters.isEquipmentProficient[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]).toBeTruthy()
    })
    it('should return false when having dagger but no weapon simple proficiency', function () {
        const oCreature = eb.createEntity(bpNormalActor)
        const oDagger = eb.createEntity(bpDagger)
        oCreature.equipItem(oDagger)
        expect(oCreature.getters.isEquipmentProficient[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]).toBeFalsy()
    })
    it('should return true when having dagger and weapon simple proficiency', function () {
        const oCreature = eb.createEntity(bpNormalActor)
        const oDagger = eb.createEntity(bpDagger)
        oCreature.equipItem(oDagger)
        oCreature.mutations.addProficiency({ value: CONSTS.PROFICIENCY_WEAPON_SIMPLE })
        expect(oCreature.getters.isEquipmentProficient[CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]).toBeTruthy()
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
            damageType: CONSTS.DAMAGE_TYPE_SLASHING,
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
            damageType: CONSTS.DAMAGE_TYPE_SLASHING,
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

describe('getWeaponRanges', function () {
    it('should return melee: 5, ranged: 0 when equipping NO weapon', function () {
        const oCreature = eb.createEntity(bpNormalActor)
        expect(oCreature.getters.getWeaponRanges).toEqual({
            [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]: 5,
            [CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED]: 0
        })
    })
    it('should return melee 5, ranged 0 when equipping ranged weapon without ammo', function () {
        const oCreature = eb.createEntity(bpNormalActor)
        const oBow = eb.createEntity(bpShortbow)
        oCreature.equipItem(oBow)
        expect(oCreature.getters.getWeaponRanges).toEqual({
            [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]: 5,
            [CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED]: 0
        })
    })
    it('should return melee 5, ranged 100 when equipping ranged weapon with ammo', function () {
        const oCreature = eb.createEntity(bpNormalActor)
        const oBow = eb.createEntity(bpShortbow)
        const oArrow = eb.createEntity(bpArrow)
        oCreature.equipItem(oBow)
        oCreature.equipItem(oArrow)
        expect(oCreature.getters.getWeaponRanges).toEqual({
            [CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE]: 5,
            [CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED]: 100
        })
    })
})

describe('getActions', function () {
    it('should return {} when create has no action', function () {
        const oCreature = eb.createEntity(bpNormalActor)
        const a = oCreature.getters.getActions
        expect(a).toEqual({})
    })
    it('should return an action when create has one aciton defined', function () {
        const oCreature = eb.createEntity(bpNormalActor)
        oCreature.mutations.defineAction({
            id: 'a1',
            onHit: 'script1'
        })
        expect(oCreature.getters.getActions).toEqual({
            a1: {
                id: 'a1',
                attackType: CONSTS.COMBAT_ACTION_TYPE_SPELL_LIKE_ABILITY,
                cooldown: 0,
                charges: 0,
                range: Infinity,
                onHit: 'script1',
                parameters: {},
                ready: true
            }
        })
    })
    it('action with cooldown should be ready by default', function () {
        const oCreature = eb.createEntity(bpNormalActor)
        oCreature.mutations.defineAction({
            id: 'a1',
            onHit: 'script1',
            cooldown: 5
        })
        expect(oCreature.getters.getActions).toEqual({
            a1: {
                id: 'a1',
                attackType: CONSTS.COMBAT_ACTION_TYPE_SPELL_LIKE_ABILITY,
                cooldown: 0,
                charges: 0,
                range: Infinity,
                onHit: 'script1',
                parameters: {},
                ready: true
            }
        })
    })
    it('action with cooldown should not be ready when action is used', function () {
        const oCreature = eb.createEntity(bpNormalActor)
        oCreature.mutations.defineAction({
            id: 'a1',
            onHit: 'script1',
            cooldown: 5
        })
        oCreature.mutations.useAction({ action: 'a1' })
        expect(oCreature.getters.getActions).toEqual({
            a1: {
                id: 'a1',
                attackType: CONSTS.COMBAT_ACTION_TYPE_SPELL_LIKE_ABILITY,
                cooldown: 5,
                charges: 0,
                range: Infinity,
                onHit: 'script1',
                parameters: {},
                ready: false
            }
        })
    })
    it('action with cooldown should be ready when action is used and restored', function () {
        const oCreature = eb.createEntity(bpNormalActor)
        oCreature.mutations.defineAction({
            id: 'a1',
            onHit: 'script1',
            cooldown: 5
        })
        oCreature.mutations.useAction({ action: 'a1' })
        expect(oCreature.getters.getActions).toEqual({
            a1: {
                id: 'a1',
                attackType: CONSTS.COMBAT_ACTION_TYPE_SPELL_LIKE_ABILITY,
                cooldown: 5,
                charges: 0,
                range: Infinity,
                onHit: 'script1',
                parameters: {},
                ready: false
            }
        })
        oCreature.mutations.coolActionsDown()
        expect(oCreature.getters.getActions).toEqual({
            a1: {
                id: 'a1',
                attackType: CONSTS.COMBAT_ACTION_TYPE_SPELL_LIKE_ABILITY,
                cooldown: 4,
                charges: 0,
                range: Infinity,
                onHit: 'script1',
                parameters: {},
                ready: false
            }
        })
        oCreature.mutations.coolActionsDown()
        expect(oCreature.getters.getActions).toEqual({
            a1: {
                id: 'a1',
                attackType: CONSTS.COMBAT_ACTION_TYPE_SPELL_LIKE_ABILITY,
                cooldown: 3,
                charges: 0,
                range: Infinity,
                onHit: 'script1',
                parameters: {},
                ready: false
            }
        })
        oCreature.mutations.coolActionsDown()
        expect(oCreature.getters.getActions).toEqual({
            a1: {
                id: 'a1',
                attackType: CONSTS.COMBAT_ACTION_TYPE_SPELL_LIKE_ABILITY,
                cooldown: 2,
                charges: 0,
                range: Infinity,
                onHit: 'script1',
                parameters: {},
                ready: false
            }
        })
        oCreature.mutations.coolActionsDown()
        expect(oCreature.getters.getActions).toEqual({
            a1: {
                id: 'a1',
                attackType: CONSTS.COMBAT_ACTION_TYPE_SPELL_LIKE_ABILITY,
                cooldown: 1,
                charges: 0,
                range: Infinity,
                onHit: 'script1',
                parameters: {},
                ready: false
            }
        })
        oCreature.mutations.coolActionsDown()
        expect(oCreature.getters.getActions).toEqual({
            a1: {
                id: 'a1',
                attackType: CONSTS.COMBAT_ACTION_TYPE_SPELL_LIKE_ABILITY,
                cooldown: 0,
                charges: 0,
                range: Infinity,
                onHit: 'script1',
                parameters: {},
                ready: true
            }
        })
    })
    it('action with charges should be ready by default', function () {
        const oCreature = eb.createEntity(bpNormalActor)
        oCreature.mutations.defineAction({
            id: 'a1',
            onHit: 'script1',
            charges: 5
        })
        expect(oCreature.getters.getActions).toEqual({
            a1: {
                id: 'a1',
                attackType: CONSTS.COMBAT_ACTION_TYPE_SPELL_LIKE_ABILITY,
                cooldown: 0,
                charges: 5,
                range: Infinity,
                onHit: 'script1',
                parameters: {},
                ready: true
            }
        })
    })
    it('action with charges should not be ready when charges are depleted', function () {
        const oCreature = eb.createEntity(bpNormalActor)
        oCreature.mutations.defineAction({
            id: 'a1',
            onHit: 'script1',
            charges: 5
        })
        oCreature.mutations.useAction({ action: 'a1' })
        expect(oCreature.getters.getActions).toEqual({
            a1: {
                id: 'a1',
                attackType: CONSTS.COMBAT_ACTION_TYPE_SPELL_LIKE_ABILITY,
                cooldown: 0,
                charges: 4,
                range: Infinity,
                onHit: 'script1',
                parameters: {},
                ready: true
            }
        })
        oCreature.mutations.useAction({ action: 'a1' })
        expect(oCreature.getters.getActions).toEqual({
            a1: {
                id: 'a1',
                attackType: CONSTS.COMBAT_ACTION_TYPE_SPELL_LIKE_ABILITY,
                cooldown: 0,
                charges: 3,
                range: Infinity,
                onHit: 'script1',
                parameters: {},
                ready: true
            }
        })
        oCreature.mutations.useAction({ action: 'a1' })
        expect(oCreature.getters.getActions).toEqual({
            a1: {
                id: 'a1',
                attackType: CONSTS.COMBAT_ACTION_TYPE_SPELL_LIKE_ABILITY,
                cooldown: 0,
                charges: 2,
                range: Infinity,
                onHit: 'script1',
                parameters: {},
                ready: true
            }
        })
        oCreature.mutations.useAction({ action: 'a1' })
        expect(oCreature.getters.getActions).toEqual({
            a1: {
                id: 'a1',
                attackType: CONSTS.COMBAT_ACTION_TYPE_SPELL_LIKE_ABILITY,
                cooldown: 0,
                charges: 1,
                range: Infinity,
                onHit: 'script1',
                parameters: {},
                ready: true
            }
        })
        oCreature.mutations.useAction({ action: 'a1' })
        expect(oCreature.getters.getActions).toEqual({
            a1: {
                id: 'a1',
                attackType: CONSTS.COMBAT_ACTION_TYPE_SPELL_LIKE_ABILITY,
                cooldown: 0,
                charges: 0,
                range: Infinity,
                onHit: 'script1',
                parameters: {},
                ready: false
            }
        })
    })
    it('action with charges should be ready by default', function () {
        const oCreature = eb.createEntity(bpNormalActor)
        oCreature.mutations.defineAction({
            id: 'a1',
            onHit: 'script1',
            charges: 5
        })
        expect(oCreature.getters.getActions).toEqual({
            a1: {
                id: 'a1',
                attackType: CONSTS.COMBAT_ACTION_TYPE_SPELL_LIKE_ABILITY,
                cooldown: 0,
                charges: 5,
                range: Infinity,
                onHit: 'script1',
                parameters: {},
                ready: true
            }
        })
    })
    it('action with charges should be ready when depleted charges are restored', function () {
        const oCreature = eb.createEntity(bpNormalActor)
        oCreature.mutations.defineAction({
            id: 'a1',
            onHit: 'script1',
            charges: 5
        })
        oCreature.mutations.useAction({ action: 'a1' })
        oCreature.mutations.useAction({ action: 'a1' })
        oCreature.mutations.useAction({ action: 'a1' })
        oCreature.mutations.useAction({ action: 'a1' })
        oCreature.mutations.useAction({ action: 'a1' })
        expect(oCreature.getters.getActions).toEqual({
            a1: {
                id: 'a1',
                attackType: CONSTS.COMBAT_ACTION_TYPE_SPELL_LIKE_ABILITY,
                cooldown: 0,
                charges: 0,
                range: Infinity,
                onHit: 'script1',
                parameters: {},
                ready: false
            }
        })
        oCreature.mutations.restoreAction({ action: 'a1' })
        expect(oCreature.getters.getActions).toEqual({
            a1: {
                id: 'a1',
                attackType: CONSTS.COMBAT_ACTION_TYPE_SPELL_LIKE_ABILITY,
                cooldown: 0,
                charges: 5,
                range: Infinity,
                onHit: 'script1',
                parameters: {},
                ready: true
            }
        })
    })
})

describe('getEffects', function() {
    it('should return 1 when appplying long duration effect', function () {
        const c1 = new Creature({ blueprint: bpNormalActor })
        const eLight = { id: 'e1', type: 'EFFECT_LIGHT', duration: 10, amp: 0 }
        c1.mutations.addEffect({ effect: eLight })
        expect(c1.getters.getEffects.length).toBe(1)
    })
})