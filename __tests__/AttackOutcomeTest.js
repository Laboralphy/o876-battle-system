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
        ao.attack()
        expect(ao.weapon).toEqual(oSword)
        expect(ao.roll).toBe(11)
        expect(ao.attackBonus).toBe(3)
        expect(ao.hit).toBeTruthy()
        expect(ao.damages.types).toEqual({ [CONSTS.DAMAGE_TYPE_PIERCING]: { amount: 4, resisted: 0 }})
    })
})

describe('getDamageType/getAttackType/getWeaponBaseDamageAmount', function () {
    it('should return 1d3 Melee Crushing when having no weapon', function () {
        const c1 = eb.createEntity(bpNormalActor)
        c1.mutations.setLevel({ value: 5 })
        c1.dice.cheat(0.5)
        const c2 = eb.createEntity(bpNormalActor)
        c2.mutations.setLevel({ value: 5 })
        const ao = new AttackOutcome()
        ao.attacker = c1
        ao.target = c2
        ao.computeAttackParameters()
        ao.computeDefenseParameters()
        expect(ao.getAttackType()).toBe(CONSTS.ATTACK_TYPE_MELEE)
        expect(ao.getDamageType()).toBe(CONSTS.DAMAGE_TYPE_CRUSHING)
        expect(ao.getWeaponBaseDamageAmount()).toBe('1d3')
    })
    it('should return 1D4 melee piercing when equipping dagguer', function () {
        const c1 = eb.createEntity(bpNormalActor)
        c1.mutations.setLevel({ value: 5 })
        c1.dice.cheat(0.5)
        const c2 = eb.createEntity(bpNormalActor)
        c2.mutations.setLevel({ value: 5 })
        const dagger = eb.createEntity(bpDagger)
        c1.equipItem(dagger)
        const ao = new AttackOutcome()
        ao.attacker = c1
        ao.target = c2
        ao.computeAttackParameters()
        ao.computeDefenseParameters()
        expect(ao.getAttackType()).toBe(CONSTS.ATTACK_TYPE_MELEE)
        expect(ao.getDamageType()).toBe(CONSTS.DAMAGE_TYPE_PIERCING)
        expect(ao.getWeaponBaseDamageAmount()).toBe('1d4')
    })
    it('should return 1d6 piercing ranged when equipping bow with ammo', function () {
        const c1 = eb.createEntity(bpNormalActor)
        c1.mutations.setLevel({ value: 5 })
        c1.dice.cheat(0.5)
        const c2 = eb.createEntity(bpNormalActor)
        c2.mutations.setLevel({ value: 5 })
        const bow = eb.createEntity(bpShortbow)
        const arrow = eb.createEntity(bpArrow)
        c1.equipItem(bow)
        c1.equipItem(arrow)
        c1.mutations.selectOffensiveSlot({ value: CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED })
        expect(c1._store._state.selectedOffensiveSlot).toBe(CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED)
        expect(c1.getters.getOffensiveSlots).toEqual([
            CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED,
            CONSTS.EQUIPMENT_SLOT_AMMO
        ])
        const ao = new AttackOutcome()
        ao.attacker = c1
        ao.target = c2
        ao.computeAttackParameters()
        ao.computeDefenseParameters()
        expect(ao.getAttackType()).toBe(CONSTS.ATTACK_TYPE_RANGED)
        expect(ao.getDamageType()).toBe(CONSTS.DAMAGE_TYPE_PIERCING)
        expect(ao.getWeaponBaseDamageAmount()).toBe('1d6')
    })
    it('should throw error when equipping bow without ammo', function () {
        const c1 = eb.createEntity(bpNormalActor)
        c1.mutations.setLevel({ value: 5 })
        c1.dice.cheat(0.5)
        const c2 = eb.createEntity(bpNormalActor)
        c2.mutations.setLevel({ value: 5 })
        const bow = eb.createEntity(bpShortbow)
        c1.equipItem(bow)
        c1.mutations.selectOffensiveSlot({ value: CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED })
        expect(c1._store._state.selectedOffensiveSlot).toBe(CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED)
        expect(c1.getters.getOffensiveSlots).toEqual([
            CONSTS.EQUIPMENT_SLOT_WEAPON_RANGED
        ])
        const ao = new AttackOutcome()
        ao.attacker = c1
        ao.target = c2
        ao.computeAttackParameters()
        ao.computeDefenseParameters()
        expect(ao.getAttackType()).toBe(CONSTS.ATTACK_TYPE_RANGED)
        expect(() => ao.getDamageType()).not.toThrow()
        expect(ao.getDamageType()).toBe(CONSTS.DAMAGE_TYPE_PIERCING)
        expect(ao.getWeaponBaseDamageAmount()).toBe('1d6')
    })
})

describe('Sneak attack', function () {
    it('should not do a sneak attack when attacking in plain sight', function () {
        // setup attacker
        const c1 = eb.createEntity(bpNormalActor)
        c1.mutations.setLevel({ value: 5 })
        c1.dice.cheat(0.5)
        const sword1 = eb.createEntity(bpShortSword)
        c1.equipItem(sword1)
        c1.mutations.addProperty({ property: {
                type: CONSTS.PROPERTY_SNEAK_ATTACK,
                amp: 3
            }})

        // setup target
        const c2 = eb.createEntity(bpNormalActor)
        c2.mutations.setLevel({ value: 2 })
        c2.dice.cheat(0.3)
        const sword2 = eb.createEntity(bpShortSword)
        c2.equipItem(sword2)

        // assaut
        const ao = new AttackOutcome()
        ao.attacker = c1
        ao.target = c2
        ao.computeAttackParameters()
        ao.computeDefenseParameters()
        expect(ao.sneak).toBe(0)

        ao.attack()
        expect(ao.damages.types.DAMAGE_TYPE_PIERCING.amount).toBe(4)
    })
    describe('when attacker have a stealth effect', function () {
        it('should have three ranks in sneak when having prop sneak attack III', function () {
            // setup attacker
            const c1 = eb.createEntity(bpNormalActor)
            c1.mutations.setLevel({ value: 5 })
            c1.dice.cheat(0.5)
            const sword1 = eb.createEntity(bpShortSword)
            c1.equipItem(sword1)
            c1.mutations.addProperty({ property: {
                    type: CONSTS.PROPERTY_SNEAK_ATTACK,
                    amp: 3
                }})

            c1.mutations.addEffect({ effect: {
                    type: CONSTS.EFFECT_STEALTH,
                    amp: 0,
                    duration: 10,
                    source: c1.id,
                    data: {}
                }})

            // setup target
            const c2 = eb.createEntity(bpNormalActor)
            c2.mutations.setLevel({ value: 2 })
            c2.dice.cheat(0.3)
            const sword2 = eb.createEntity(bpShortSword)
            c2.equipItem(sword2)

            // assaut
            const ao = new AttackOutcome()
            ao.attacker = c1
            ao.target = c2
            ao.computeAttackParameters()
            ao.computeDefenseParameters()
            expect(c2.getCreatureVisibility(c1)).toBe(CONSTS.CREATURE_VISIBILITY_HIDDEN)
            expect(ao.visibility).toBe(CONSTS.CREATURE_VISIBILITY_HIDDEN)

            ao.attack()
            expect(ao.sneak).toBe(3)
            expect(ao.damages.types.DAMAGE_TYPE_PIERCING.amount).toBe(16) // 4 base + 3*4 sneak attack
        })
        it('should triggers a stealth skill check and investigation skill check after attacking', function () {
            // setup attacker
            const c1 = eb.createEntity(bpNormalActor)
            c1.mutations.setLevel({ value: 5 })
            c1.dice.cheat(0.5)
            const sword1 = eb.createEntity(bpShortSword)
            c1.equipItem(sword1)
            c1.mutations.addProperty({ property: {
                    type: CONSTS.PROPERTY_SNEAK_ATTACK,
                    amp: 3
                }})

            c1.mutations.addEffect({ effect: {
                    type: CONSTS.EFFECT_STEALTH,
                    amp: 0,
                    duration: 10,
                    source: c1.id,
                    data: {}
                }})

            // setup target
            const c2 = eb.createEntity(bpNormalActor)
            c2.mutations.setLevel({ value: 2 })
            c2.dice.cheat(0.3)
            const sword2 = eb.createEntity(bpShortSword)
            c2.equipItem(sword2)

            const c1log = []
            const c2log = []

            c1.events.on(CONSTS.EVENT_CREATURE_SKILL_CHECK, evt => {
                c1log.push(evt)
            })
            c2.events.on(CONSTS.EVENT_CREATURE_SKILL_CHECK, evt => {
                c2log.push(evt)
            })

            // assaut
            const ao = new AttackOutcome()
            ao.attacker = c1
            ao.target = c2
            ao.computeAttackParameters()
            ao.computeDefenseParameters()

            ao.attack()

            expect(c1log).toEqual([{
                skill: 'SKILL_STEALTH',
                roll: 11,
                bonus: 0,
                dc: 0,
                success: true // always a success : only th roll+bonus is relevant
            }])

            expect(c2log).toEqual([
                {
                    "bonus": 0,
                    "dc": 11,
                    "roll": 7,
                    "skill": "SKILL_PERCEPTION",
                    "success": false
                }
            ])
        })
    })
})