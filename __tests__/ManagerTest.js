const Manager = require('../src/Manager')
const CONSTS = require("../src/consts");
const CombatManager = require("../src/libs/combat/CombatManager");
const Creature = require("../src/Creature");

const bpNormalActor = {
    entityType: CONSTS.ENTITY_TYPE_ACTOR,
    specie: CONSTS.SPECIE_HUMANOID,
    race: CONSTS.RACE_HUMAN,
    ac: 0,
    proficiencies: [],
    speed: 30,
    classType: CONSTS.CLASS_TYPE_TOURIST,
    level: 5,
    hd: 6,
    actions: [],
    equipment: []
}

describe('createEntity / destroyEntity', function () {
    it('should add creature to horde when creating creature', function () {
        const m = new Manager()
        const c1 = m.createEntity(bpNormalActor, 'c1')
        expect(Object.values(m.horde.creatures)).toHaveLength(1)
        expect(m.horde.creatures['c1']).toBeDefined()
        expect(m.horde.creatures['c1']).toBe(c1)
    })
    it('should remove creature to horde when destroying creature', function () {
        const m = new Manager()
        const c1 = m.createEntity(bpNormalActor, 'c1')
        expect(Object.values(m.horde.creatures)).toHaveLength(1)
        m.destroyEntity(c1)
        expect(m.horde.creatures['c1']).toBeUndefined()
    })
})

describe('processEntities', function () {
    it('should work fine when no creature is instanciated', function () {
        const m = new Manager()
        expect(() => m.processEntities()).not.toThrow()
    })
    it('should fire effect applied event', function () {
        const m = new Manager()
        const logs = []
        m.events.on(CONSTS.EVENT_CREATURE_EFFECT_APPLIED, evt => logs.push({
            type: 'creature.effect.applied',
            evt
        }))
        const c1 = m.createEntity(bpNormalActor, 'c1')
        const eLight = m.effectProcessor.createEffect(CONSTS.EFFECT_LIGHT)
        expect(logs).toHaveLength(0)
        m.effectProcessor.applyEffect(eLight, c1, 10)
        expect(logs).toHaveLength(1)
        expect(logs[0].evt.effect.type).toBe(CONSTS.EFFECT_LIGHT)
    })
    it('creature should be active when having a long duration effect', function () {
        const m = new Manager()
        const c1 = m.createEntity(bpNormalActor, 'c1')
        const eLight = m.effectProcessor.createEffect(CONSTS.EFFECT_LIGHT)
        expect(m.horde.isCreatureActive(c1)).toBeFalsy()
        const eApplied = m.effectProcessor.applyEffect(eLight, c1, 10)
        expect(eApplied).not.toBeNull()
        expect(eApplied.duration).toBe(10)
        const aEffects = Object
            .values(c1._store._state.effects)
            .filter(effect => effect.duration > 0)
        expect(aEffects).toHaveLength(1)
        expect(c1.getters.getEffects).toHaveLength(1)
        expect(m.horde.isCreatureActive(c1)).toBeTruthy()
    })
})

describe('Real Combat simulator', function () {
    const bpShortSword = {
        "entityType": "ENTITY_TYPE_ITEM",
        "itemType": "ITEM_TYPE_WEAPON",
        "proficiency": "PROFICIENCY_WEAPON_MARTIAL",
        "damages": "1d6",
        "damageType": "DAMAGE_TYPE_PIERCING",
        "weight": 2,
        "size": "WEAPON_SIZE_SMALL",
        "attributes": [
            "WEAPON_ATTRIBUTE_FINESSE"
        ],
        "properties": [],
        "equipmentSlots": [
            "EQUIPMENT_SLOT_WEAPON_MELEE"
        ]
    }
    it('should work as a real combat', function () {
        const m = new Manager()
        m.combatManager.defaultDistance = 50
        const logs = []
        m.events.on(CONSTS.EVENT_COMBAT_START, evt => {
            logs.push({
                event: 'combat.start',
                attacker: evt.combat.attacker.id,
                target: evt.combat.defender.id
            })
        })
        m.events.on(CONSTS.EVENT_COMBAT_END, evt => {
            logs.push({
                event: 'combat.end',
                attacker: evt.combat.attacker.id,
                target: evt.combat.defender.id
            })
        })
        m.events.on(CONSTS.EVENT_COMBAT_TURN, evt => {
            logs.push({
                event: 'combat.turn',
                attacker: evt.attacker.id,
                target: evt.target.id,
                turn: evt.turn
            })
        })
        m.events.on(CONSTS.EVENT_COMBAT_DISTANCE, evt => {
            logs.push({
                event: 'combat.distance',
                turn: evt.turn,
                attacker: evt.combat.attacker.id,
                target: evt.combat.attacker.id,
                distance: evt.distance
            })
        })
        m.events.on(CONSTS.EVENT_COMBAT_ATTACK, evt => {
            /**
             * @type {AttackOutcome}
             */
            const ao = evt.attack
            logs.push({
                event: 'combat.attack',
                attacker: ao.attacker.id,
                target: ao.target.id,
                hit: ao.hit,
                roll: ao.roll,
                ac: ao.ac,
                damages: ao.damages.amount
            })
        })
        const c1 = m.createEntity(bpNormalActor, 'c1')
        const c2 = m.createEntity(bpNormalActor, 'c2')
        const sw1 = m.createEntity(bpShortSword)
        const sw2 = m.createEntity(bpShortSword)
        c1.equipItem(sw1)
        c2.equipItem(sw2)
        c1.dice.cheat(0.5)
        c2.dice.cheat(0.4)
        m.startCombat(c1, c2)
        const process = () => {
            m.processEntities()
            for (let i = 0; i < m.combatManager.defaultTickCount; ++i) {
                m.processCombats()
            }
        }
        expect(m.combatManager.combats).toHaveLength(2)
        expect(m.combatManager.combats[0].distance).toBe(50)
        expect(m.combatManager.combats[1].distance).toBe(50)
        process()
        expect(m.combatManager.combats[0].distance).toBe(5)
        expect(m.combatManager.combats[1].distance).toBe(5)
        expect(m.combatManager.combats[0].attacker.getters.getSelectedWeapon).toBeDefined()
        expect(m.combatManager.combats[0].attacker.getters.getSelectedWeapon.blueprint.damages).toBe('1d6')
        process()
        process()
        process()
        process()
        process()
        process()
        process()
        expect(logs).toEqual([
            { event: 'combat.start', attacker: 'c1', target: 'c2' },
            { event: 'combat.start', attacker: 'c2', target: 'c1' },
            { event: 'combat.turn', attacker: 'c1', target: 'c2', turn: 0 },
            { event: 'combat.distance', turn: 0, attacker: 'c1', target: 'c1', distance: 20 },
            { event: 'combat.turn', attacker: 'c2', target: 'c1', turn: 0 },
            { event: 'combat.distance', turn: 0, attacker: 'c2', target: 'c2', distance: 5 },
            {
                event: 'combat.attack',
                attacker: 'c1',
                target: 'c2',
                hit: true,
                roll: 11,
                ac: 10,
                damages: 4
            },
            {
                event: 'combat.attack',
                attacker: 'c2',
                target: 'c1',
                hit: false,
                roll: 9,
                ac: 10,
                damages: 0
            },
            { event: 'combat.turn', attacker: 'c1', target: 'c2', turn: 1 },
            { event: 'combat.turn', attacker: 'c2', target: 'c1', turn: 1 },
            {
                event: 'combat.attack',
                attacker: 'c1',
                target: 'c2',
                hit: true,
                roll: 11,
                ac: 10,
                damages: 4
            },
            {
                event: 'combat.attack',
                attacker: 'c2',
                target: 'c1',
                hit: false,
                roll: 9,
                ac: 10,
                damages: 0
            },
            { event: 'combat.turn', attacker: 'c1', target: 'c2', turn: 2 },
            { event: 'combat.turn', attacker: 'c2', target: 'c1', turn: 2 },
            {
                event: 'combat.attack',
                attacker: 'c1',
                target: 'c2',
                hit: true,
                roll: 11,
                ac: 10,
                damages: 4
            },
            {
                event: 'combat.attack',
                attacker: 'c2',
                target: 'c1',
                hit: false,
                roll: 9,
                ac: 10,
                damages: 0
            },
            { event: 'combat.turn', attacker: 'c1', target: 'c2', turn: 3 },
            { event: 'combat.turn', attacker: 'c2', target: 'c1', turn: 3 },
            {
                event: 'combat.attack',
                attacker: 'c1',
                target: 'c2',
                hit: true,
                roll: 11,
                ac: 10,
                damages: 4
            },
            {
                event: 'combat.attack',
                attacker: 'c2',
                target: 'c1',
                hit: false,
                roll: 9,
                ac: 10,
                damages: 0
            },
            { event: 'combat.turn', attacker: 'c1', target: 'c2', turn: 4 },
            { event: 'combat.turn', attacker: 'c2', target: 'c1', turn: 4 },
            {
                event: 'combat.attack',
                attacker: 'c1',
                target: 'c2',
                hit: true,
                roll: 11,
                ac: 10,
                damages: 4
            },
            {
                event: 'combat.attack',
                attacker: 'c2',
                target: 'c1',
                hit: false,
                roll: 9,
                ac: 10,
                damages: 0
            },
            { event: 'combat.turn', attacker: 'c1', target: 'c2', turn: 5 },
            { event: 'combat.turn', attacker: 'c2', target: 'c1', turn: 5 },
            {
                event: 'combat.attack',
                attacker: 'c1',
                target: 'c2',
                hit: true,
                roll: 11,
                ac: 10,
                damages: 4
            },
            {
                event: 'combat.attack',
                attacker: 'c2',
                target: 'c1',
                hit: false,
                roll: 9,
                ac: 10,
                damages: 0
            },
            { event: 'combat.turn', attacker: 'c1', target: 'c2', turn: 6 },
            { event: 'combat.turn', attacker: 'c2', target: 'c1', turn: 6 },
            {
                event: 'combat.attack',
                attacker: 'c1',
                target: 'c2',
                hit: true,
                roll: 11,
                ac: 10,
                damages: 4
            },
            {
                event: 'combat.attack',
                attacker: 'c2',
                target: 'c1',
                hit: false,
                roll: 9,
                ac: 10,
                damages: 0
            },
            { event: 'combat.turn', attacker: 'c1', target: 'c2', turn: 7 },
            { event: 'combat.turn', attacker: 'c2', target: 'c1', turn: 7 },
            {
                event: 'combat.attack',
                attacker: 'c1',
                target: 'c2',
                hit: true,
                roll: 11,
                ac: 10,
                damages: 4
            },
            { event: 'combat.end', attacker: 'c2', target: 'c1' },
            { event: 'combat.end', attacker: 'c1', target: 'c2' }
        ])
    })
})


describe('attack advantage', function () {
    describe('when target cannot see attacker', function () {
        it('should have advantage on attack when target is blinded', function () {
            const m = new Manager()
            const cm = m.combatManager
            cm.defaultDistance = 50
            const c1 = m.createEntity(bpNormalActor, 'c1')
            const c2 = m.createEntity(bpNormalActor, 'c2')
            const combat = m.startCombat(c1, c2)
            const logs = []
            m.events.on(CONSTS.EVENT_COMBAT_ATTACK, evt => {
                const a = evt.attack
                logs.push({
                    attacker: a.attacker.id,
                    rollBias: a.rollBias
                })
            })
            m.processEntities()
            m.processCombats()
            m.processCombats()
            m.processCombats()
            m.processCombats()
            m.processCombats()
            m.processCombats()

            expect(logs[0].rollBias.result).toBe(0)
            expect(logs[1].rollBias.result).toBe(0)

            const eBlind = m.createEffect(CONSTS.EFFECT_BLINDNESS)
            m.applyEffect(eBlind, c2, 10)

            m.processEntities()
            m.processCombats()
            m.processCombats()
            m.processCombats()
            m.processCombats()
            m.processCombats()
            m.processCombats()

            // target can't detect attacker
            // attack should be advantaged
            expect(logs[2].attacker).toBe(c1.id)
            expect(logs[2].rollBias.result).toBe(1)
            expect(logs[2].rollBias.advantages.size).toBe(1)
            expect(logs[2].rollBias.advantages.has(CONSTS.ADV_ATTACK_UNDETECTED_BY_TARGET)).toBeTruthy()

            expect(logs[3].attacker).toBe(c2.id)
            expect(logs[3].rollBias.result).toBe(-1)
            expect(logs[3].rollBias.disadvantages.size).toBe(1)
            expect(logs[3].rollBias.disadvantages.has(CONSTS.DIS_ATTACK_TARGET_UNDETECTED)).toBeTruthy()
        })
    })
})