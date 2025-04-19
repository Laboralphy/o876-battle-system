const Manager = require('../src/Manager');
const CONSTS = require('../src/consts');
const PropertyBuilder = require('../src/PropertyBuilder');

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
    equipment: [
        'natwpn-punch-1d3'
    ]
};

const bpNaturalWeapon = {
    size: CONSTS.WEAPON_SIZE_SMALL,
    weight: 0,
    proficiency: CONSTS.PROFICIENCY_WEAPON_SIMPLE,
    equipmentSlots: [CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1, CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_2, CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_3]
};

const bpClaws2d6 = {
    entityType: CONSTS.ENTITY_TYPE_ITEM,
    itemType: CONSTS.ITEM_TYPE_WEAPON,
    extends: ['bpNaturalWeapon'],
    damages: '2d6',
    damageType: CONSTS.DAMAGE_TYPE_SLASHING,
    size: CONSTS.WEAPON_SIZE_SMALL,
    properties: [],
    attributes: []
};

const bpFangs3d6 = {
    entityType: CONSTS.ENTITY_TYPE_ITEM,
    itemType: CONSTS.ITEM_TYPE_WEAPON,
    extends: ['bpNaturalWeapon'],
    damages: '3d6',
    damageType: CONSTS.DAMAGE_TYPE_PIERCING,
    size: CONSTS.WEAPON_SIZE_SMALL,
    properties: [],
    attributes: []
};

const bpSting1d6Poison = {
    entityType: CONSTS.ENTITY_TYPE_ITEM,
    itemType: CONSTS.ITEM_TYPE_WEAPON,
    extends: ['bpNaturalWeapon'],
    damages: '1d6',
    damageType: CONSTS.DAMAGE_TYPE_PIERCING,
    size: CONSTS.WEAPON_SIZE_SMALL,
    properties: [{
        type: CONSTS.PROPERTY_ON_ATTACK_HIT,
        ailment: CONSTS.ON_ATTACK_HIT_POISON,
        amp: '1d2',
        subtype: CONSTS.EFFECT_SUBTYPE_EXTRAORDINARY,
        duration: 11
    }],
    attributes: []
};

const bpMonster1 = {
    entityType: CONSTS.ENTITY_TYPE_ACTOR,
    specie: CONSTS.SPECIE_MONSTROSITY,
    race: CONSTS.RACE_UNKNOWN,
    ac: 0,
    proficiencies: [],
    speed: 30,
    classType: CONSTS.CLASS_TYPE_MONSTER,
    level: 1,
    hd: 6,
    actions: [],
    equipment: [
        'bpClaws2d6',
        'bpFangs3d6'
    ]
};

const bpMonster2 = {
    entityType: CONSTS.ENTITY_TYPE_ACTOR,
    specie: CONSTS.SPECIE_MONSTROSITY,
    race: CONSTS.RACE_UNKNOWN,
    ac: 0,
    proficiencies: [],
    speed: 30,
    classType: CONSTS.CLASS_TYPE_MONSTER,
    level: 1,
    hd: 6,
    actions: [],
    equipment: [
        'bpSting1d6Poison'
    ]
};

const bpHydra = {
    'entityType': 'ENTITY_TYPE_ACTOR',
    'classType': 'CLASS_TYPE_MONSTER',
    'proficiencies': [
        'PROFICIENCY_WEAPON_NATURAL',
        'PROFICIENCY_WEAPON_SIMPLE',
        'PROFICIENCY_WEAPON_MARTIAL',
        'PROFICIENCY_ARMOR_LIGHT',
        'PROFICIENCY_ARMOR_MEDIUM',
        'PROFICIENCY_ARMOR_HEAVY'
    ],
    'abilities': {
        'strength': 20,
        'dexterity': 12,
        'constitution': 20,
        'intelligence': 2,
        'wisdom': 10,
        'charisma': 7
    },
    'equipment': [
        {
            'entityType': 'ENTITY_TYPE_ITEM',
            'itemType': 'ITEM_TYPE_WEAPON',
            'tag': 'natural-weapon-bite',
            'proficiency': 'PROFICIENCY_WEAPON_NATURAL',
            'weight': 0,
            'size': 'WEAPON_SIZE_SMALL',
            'attributes': [],
            'damages': '1d10',
            'damageType': 'DAMAGE_TYPE_PIERCING',
            'properties': [],
            'equipmentSlots': [
                'EQUIPMENT_SLOT_NATURAL_WEAPON_1',
                'EQUIPMENT_SLOT_NATURAL_WEAPON_2',
                'EQUIPMENT_SLOT_NATURAL_WEAPON_3'
            ]
        }
    ],
    'properties': [
        {
            'type': 'PROPERTY_DARKVISION',
            'amp': 0
        },
        {
            'type': 'PROPERTY_MULTI_ATTACK',
            'amp': 4
        }
    ],
    'actions': [],
    'specie': 'SPECIE_MONSTROSITY',
    'ac': 4,
    'level': 15,
    'hd': 12,
    'speed': 30
};



describe('createEntity / destroyEntity', function () {
    it('should add creature to horde when creating creature', function () {
        const m = new Manager();
        const c1 = m.createEntity(bpNormalActor, 'c1');
        expect(m.horde.count).toBe(1);
        expect(m.horde.getCreature('c1')).toBeDefined();
        expect(m.horde.getCreature('c1')).toBe(c1);
    });
    it('should remove creature to horde when destroying creature', function () {
        const m = new Manager();
        const c1 = m.createEntity(bpNormalActor, 'c1');
        expect(m.horde.count).toBe(1);
        m.destroyEntity(c1);
        expect(m.horde.getCreature('c1')).toBeUndefined();
    });
});

describe('processEntities', function () {
    it('should work fine when no creature is instanciated', function () {
        const m = new Manager();
        expect(() => m.processEntities()).not.toThrow();
    });
    it('should fire effect applied event', function () {
        const m = new Manager();
        const logs = [];
        m.events.on(CONSTS.EVENT_CREATURE_EFFECT_APPLIED, evt => logs.push({
            type: 'creature.effect.applied',
            evt
        }));
        const c1 = m.createEntity(bpNormalActor, 'c1');
        const eLight = m.effectProcessor.createEffect(CONSTS.EFFECT_LIGHT);
        expect(logs).toHaveLength(0);
        m.effectProcessor.applyEffect(eLight, c1, 10);
        expect(logs).toHaveLength(1);
        expect(logs[0].evt.effect.type).toBe(CONSTS.EFFECT_LIGHT);
    });
    it('creature should be active when having a long duration effect', function () {
        const m = new Manager();
        const c1 = m.createEntity(bpNormalActor, 'c1');
        const eLight = m.effectProcessor.createEffect(CONSTS.EFFECT_LIGHT);
        expect(m.horde.isCreatureActive(c1)).toBeFalsy();
        const eApplied = m.effectProcessor.applyEffect(eLight, c1, 10);
        expect(eApplied).not.toBeNull();
        expect(eApplied.duration).toBe(10);
        const aEffects = Object
            .values(c1._store._state.effects)
            .filter(effect => effect.duration > 0);
        expect(aEffects).toHaveLength(1);
        expect(c1.getters.getEffects).toHaveLength(1);
        expect(m.horde.isCreatureActive(c1)).toBeTruthy();
    });
});

describe('Real Combat simulator', function () {
    const bpShortSword = {
        'entityType': 'ENTITY_TYPE_ITEM',
        'itemType': 'ITEM_TYPE_WEAPON',
        'proficiency': 'PROFICIENCY_WEAPON_MARTIAL',
        'damages': '1d6',
        'damageType': 'DAMAGE_TYPE_PIERCING',
        'weight': 2,
        'size': 'WEAPON_SIZE_SMALL',
        'attributes': [
            'WEAPON_ATTRIBUTE_FINESSE'
        ],
        'properties': [],
        'equipmentSlots': [
            'EQUIPMENT_SLOT_WEAPON_MELEE'
        ]
    };
    it('should work as a real combat', function () {
        const m = new Manager();
        m.combatManager.defaultDistance = 50;
        const logs = [];
        m.events.on(CONSTS.EVENT_COMBAT_START, evt => {
            logs.push({
                event: 'combat.start',
                attacker: evt.attacker.id,
                target: evt.target.id,
                attackerHP: evt.attacker.getters.getHitPoints,
                targetHP: evt.target.getters.getHitPoints
            });
        });
        m.events.on(CONSTS.EVENT_COMBAT_END, evt => {
            logs.push({
                event: 'combat.end',
                attacker: evt.attacker.id,
                target: evt.target.id,
                attackerHP: evt.attacker.getters.getHitPoints,
                targetHP: evt.target.getters.getHitPoints
            });
        });
        m.events.on(CONSTS.EVENT_COMBAT_TURN, evt => {
            const combat = m.combatManager.getCombat(evt.attacker);
            logs.push({
                event: 'combat.turn',
                attacker: evt.attacker.id,
                target: evt.target.id,
                turn: evt.turn,
                attackerHP: combat.attacker.getters.getHitPoints,
                targetHP: combat.target.getters.getHitPoints
            });
        });
        m.events.on(CONSTS.EVENT_COMBAT_DISTANCE, evt => {
            const combat = m.combatManager.getCombat(evt.attacker);
            logs.push({
                event: 'combat.distance',
                turn: combat.turn,
                attacker: evt.attacker.id,
                target: evt.attacker.id,
                distance: evt.distance
            });
        });
        m.events.on(CONSTS.EVENT_COMBAT_ATTACK, ao => {
            logs.push({
                event: 'combat.attack',
                attacker: ao.attacker.id,
                target: ao.target.id,
                hit: ao.hit,
                roll: ao.roll,
                ac: ao.ac,
                attackerHP: ao.attacker.getters.getHitPoints,
                targetHP: ao.target.getters.getHitPoints
            });
        });
        const c1 = m.createEntity(bpNormalActor, 'c1');
        const c2 = m.createEntity(bpNormalActor, 'c2');
        const sw1 = m.createEntity(bpShortSword);
        const sw2 = m.createEntity(bpShortSword);
        c1.equipItem(sw1);
        c2.equipItem(sw2);
        c1.dice.cheat(0.5);
        c2.dice.cheat(0.4);
        m.startCombat(c1, c2);
        const process = () => {
            m.processEntities();
            for (let i = 0; i < m.combatManager.defaultTickCount; ++i) {
                m.processCombats();
            }
        };
        expect(m.combatManager.combats).toHaveLength(2);
        expect(m.combatManager.combats[0].distance).toBe(50);
        expect(m.combatManager.combats[1].distance).toBe(50);
        process();
        expect(m.combatManager.combats[0].distance).toBe(5);
        expect(m.combatManager.combats[1].distance).toBe(5);
        expect(m.combatManager.combats[0].attacker.getters.getSelectedWeapon).toBeDefined();
        expect(m.combatManager.combats[0].attacker.getters.getSelectedWeapon.blueprint.damages).toBe('1d6');
        process();
        // process()
        // process()
        // process()
        // process()
        // process()
        // process()

        expect(logs).toHaveLength(11);

        expect(logs[0]).toEqual({
            event: 'combat.start',
            attacker: 'c1',
            target: 'c2',
            attackerHP: 17,
            targetHP: 17
        });

        expect(logs[1]).toEqual({
            attacker: 'c1',
            attackerHP: 17,
            event: 'combat.turn',
            target: 'c2',
            targetHP: 17,
            turn: 0
        });

        expect(logs[2]).toEqual({
            'attacker': 'c1',
            'distance': 20,
            'event': 'combat.distance',
            'target': 'c1',
            'turn': 0
        });

        expect(logs[3]).toEqual({
            'attacker': 'c2',
            'attackerHP': 17,
            'event': 'combat.turn',
            'target': 'c1',
            'targetHP': 17,
            'turn': 0
        });

        expect(logs[4]).toEqual({
            'attacker': 'c2',
            'distance': 5,
            'event': 'combat.distance',
            'target': 'c2',
            'turn': 0
        });

        expect(logs[5]).toEqual({
            'ac': 10,
            'attacker': 'c1',
            'attackerHP': 17,
            'event': 'combat.attack',
            'hit': true,
            'roll': 11,
            'target': 'c2',
            'targetHP': 13
        });

        expect(logs[6]).toEqual({
            'ac': 10,
            'attacker': 'c2',
            'attackerHP': 13,
            'event': 'combat.attack',
            'hit': false,
            'roll': 9,
            'target': 'c1',
            'targetHP': 17
        });

        expect(logs[7]).toEqual({
            'attacker': 'c1',
            'attackerHP': 17,
            'event': 'combat.turn',
            'target': 'c2',
            'targetHP': 13,
            'turn': 1
        });

        expect(logs[8]).toEqual({
            'attacker': 'c2',
            'attackerHP': 13,
            'event': 'combat.turn',
            'target': 'c1',
            'targetHP': 17,
            'turn': 1
        });

        expect(logs[9]).toEqual({
            'ac': 10,
            'attacker': 'c1',
            'attackerHP': 17,
            'event': 'combat.attack',
            'hit': true,
            'roll': 11,
            'target': 'c2',
            'targetHP': 11
        });

        expect(logs[10]).toEqual({
            'ac': 10,
            'attacker': 'c2',
            'attackerHP': 11,
            'event': 'combat.attack',
            'hit': false,
            'roll': 9,
            'target': 'c1',
            'targetHP': 17
        });
    });
});


describe('attack advantage', function () {
    describe('when target cannot see attacker', function () {
        it('should have advantage on attack when target is blinded', function () {
            const m = new Manager();
            const cm = m.combatManager;
            cm.defaultDistance = 5;
            const c1 = m.createEntity(bpNormalActor, 'c1');
            const c2 = m.createEntity(bpNormalActor, 'c2');
            expect(c1.getters.getEquipment[CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1]).toBeDefined();
            const combat = m.startCombat(c1, c2);
            const logs = [];
            m.events.on(CONSTS.EVENT_COMBAT_ATTACK, evt => {
                /**
                 * @type {CombatAttackEvent}
                 */
                const a = evt;
                logs.push({
                    attacker: a.attacker.id,
                    rollBias: a.bias,
                    advantages: a.advantages,
                    disadvantages: a.disadvantages
                });
            });
            m.processEntities();
            m.processCombats();
            m.processCombats();
            m.processCombats();
            m.processCombats();
            m.processCombats();
            m.processCombats();

            expect(logs[0].rollBias).toBe(0);
            expect(logs[1].rollBias).toBe(0);

            const eBlind = m.createEffect(CONSTS.EFFECT_BLINDNESS);
            m.applyEffect(eBlind, c2, 10);

            m.processEntities();
            m.processCombats();
            m.processCombats();
            m.processCombats();
            m.processCombats();
            m.processCombats();
            m.processCombats();

            // target can't detect attacker
            // attack should be advantaged
            expect(logs[2].attacker).toBe(c1.id);
            expect(logs[2].rollBias).toBe(1);
            expect(logs[2].advantages.length).toBe(1);
            expect(logs[2].advantages.includes(CONSTS.ADV_ATTACK_ROLL_UNDETECTED_BY_TARGET)).toBeTruthy();

            expect(logs[3].attacker).toBe(c2.id);
            expect(logs[3].rollBias).toBe(-1);
            expect(logs[3].disadvantages.length).toBe(1);
            expect(logs[3].disadvantages.includes(CONSTS.DIS_ATTACK_ROLL_TARGET_UNDETECTED)).toBeTruthy();
        });
    });
});

describe('combat with monster with on-attack-hit property weapon', function () {
    it('should apply poison when attack hit', function () {
        const m = new Manager();
        const cm = m.combatManager;
        cm.defaultDistance = 50;
        m.defineModule({
            blueprints: {
                bpNaturalWeapon,
                bpClaws2d6,
                bpFangs3d6,
                bpSting1d6Poison,
                bpNormalActor,
                bpMonster1,
                bpMonster2
            }
        });
        const c1 = m.createEntity('bpNormalActor', 'player');
        const c2 = m.createEntity('bpMonster2', 'monster');
        c2.dice.cheat(0.6);
        c1.dice.cheat(0.5);
        const oCombat = m.startCombat(c2, c1);
        oCombat.distance = 5;
        expect(oCombat.getMostSuitableSlot()).toBe(CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1);
        const logs = [];
        m.events.on(CONSTS.EVENT_COMBAT_ATTACK, evt => logs.push({
            what: 'attack',
            who: evt.attacker.id
        }));
        m.events.on(CONSTS.EVENT_CREATURE_EFFECT_APPLIED, evt => logs.push({
            what: 'effect applied',
            who: evt.creature.id,
            effect: evt.effect
        }));
        cm.processCombats();
        cm.processCombats();
        cm.processCombats();
        cm.processCombats();
        cm.processCombats();
        cm.processCombats();
        expect(logs[0]).toEqual(expect.objectContaining({
            what: 'effect applied',
            who: 'player',
            effect: expect.objectContaining({
                type: 'EFFECT_DAMAGE',
                subtype: 'EFFECT_SUBTYPE_EXTRAORDINARY',
                amp: '1d2',
                data: {
                    damageType: 'DAMAGE_TYPE_POISON',
                    appliedAmount: 2,
                    resistedAmount: 0,
                    critical: false
                },
                duration: 11,
                target: 'player',
                source: 'monster',
                siblings: [],
                tag: ''
            })
        }));
        expect(c1.getters.getConditionSet.has(CONSTS.CONDITION_POISONED)).toBeTruthy();
    });
});

describe('deliverAttack', function () {
    it('should deliver additional damage when specified', function () {
        const m = new Manager();
        m.combatManager.defaultDistance = 5;
        m.defineModule({
            blueprints: {
                bpNaturalWeapon,
                bpClaws2d6,
                bpFangs3d6,
                bpSting1d6Poison,
                bpNormalActor,
                bpMonster1,
                bpMonster2,
                bpHydra
            }
        });
        const p1 = m.createEntity('bpNormalActor', 'player1');
        const p2 = m.createEntity('bpNormalActor', 'player2');
        p1.mutations.selectOffensiveSlot({ value: CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1 });
        p2.mutations.selectOffensiveSlot({ value: CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1 });
        const oP1Weapon = p1.getters.getEquipment[CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1];
        expect(oP1Weapon).toBeDefined();
        expect(p1.getters.getSelectedWeapon).toEqual(oP1Weapon);
        p1.dice.cheat(0.9);
        p2.dice.cheat(0.1);
        const logs = [];
        m.events.on(CONSTS.EVENT_COMBAT_ATTACK, (evt) => {
            if (evt.attacker.id === 'player1') {
                logs.push(evt);
            }
        });
        m.startCombat(p1, p2);
        m.deliverAttack(p1, p2, { additionalWeaponDamage: '6d10' });
        expect(logs[0].rush).toBeTruthy();
        expect(logs[0].damages.amount).toBe(63);
    });
});

describe('Multiattack', function () {
    it('should attack 5 offenders', function () {
        const m = new Manager();
        const cm = m.combatManager;
        cm.defaultDistance = 5;
        m.defineModule({
            blueprints: {
                bpNaturalWeapon,
                bpClaws2d6,
                bpFangs3d6,
                bpSting1d6Poison,
                bpNormalActor,
                bpMonster1,
                bpMonster2,
                bpHydra
            }
        });
        const c1 = m.createEntity('bpHydra', 'hydra');
        const p1 = m.createEntity('bpNormalActor', 'player1');
        const p2 = m.createEntity('bpNormalActor', 'player2');
        const p3 = m.createEntity('bpNormalActor', 'player3');
        const p4 = m.createEntity('bpNormalActor', 'player4');
        const p5 = m.createEntity('bpNormalActor', 'player5');
        c1.dice.cheat(0.5);
        p1.dice.cheat(0.5);
        p2.dice.cheat(0.5);
        p3.dice.cheat(0.5);
        p4.dice.cheat(0.5);
        p5.dice.cheat(0.5);
        const logs = [];
        m.events.on(CONSTS.EVENT_COMBAT_ATTACK, (evt) => {
            if (evt.attacker.id === 'hydra') {
                logs.push({
                    attacker: evt.attacker.id,
                    target: evt.target.id
                });
            }
        });
        m.startCombat(p1, c1);
        m.startCombat(p2, c1);
        m.startCombat(p3, c1);
        m.startCombat(p4, c1);
        m.startCombat(p5, c1);
        m.processCombats();
        m.processCombats();
        m.processCombats();
        m.processCombats();
        m.processCombats();
        m.processCombats();
        expect(logs).toEqual([
            { attacker: 'hydra', target: 'player4' },
            { attacker: 'hydra', target: 'player5' },
            { attacker: 'hydra', target: 'player2' },
            { attacker: 'hydra', target: 'player3' },
            { attacker: 'hydra', target: 'player1' }
        ]);
    });
    it('should do one attack per turn when only one offender is attacking', function () {
        const m = new Manager();
        const cm = m.combatManager;
        cm.defaultDistance = 5;
        m.defineModule({
            blueprints: {
                bpNaturalWeapon,
                bpClaws2d6,
                bpFangs3d6,
                bpSting1d6Poison,
                bpNormalActor,
                bpMonster1,
                bpMonster2,
                bpHydra
            }
        });
        const c1 = m.createEntity('bpHydra', 'hydra');
        const p1 = m.createEntity('bpNormalActor', 'player1');
        c1.dice.cheat(0.5);
        p1.dice.cheat(0.5);
        const logs = [];
        m.events.on(CONSTS.EVENT_COMBAT_ATTACK, (evt) => {
            if (evt.attacker.id === 'hydra') {
                logs.push({
                    attacker: evt.attacker.id,
                    target: evt.target.id
                });
            }
        });
        m.startCombat(p1, c1);
        m.processCombats();
        m.processCombats();
        m.processCombats();
        m.processCombats();
        m.processCombats();
        m.processCombats();
        expect(logs).toEqual([
            { attacker: 'hydra', target: 'player1' }
        ]);
    });
});

describe('Weapon with extended types', function () {
    it('should extends properties when designing a magic weapon that extends from polyvalent type', function () {
        const m = new Manager();
        m.loadModule('classic');
        const h = m.createEntity('wpn-halberd-p2', 'x1');
        expect(h.properties).toMatchObject([
            {
                type: 'PROPERTY_EXTRA_WEAPON_DAMAGE_TYPE',
                amp: 0,
                data: { damageType: 'DAMAGE_TYPE_PIERCING' }
            },
            {
                type: 'PROPERTY_ATTACK_MODIFIER',
                amp: 2,
                data: { attackType: 'ATTACK_TYPE_ANY' }
            },
            {
                type: 'PROPERTY_DAMAGE_MODIFIER',
                amp: 2,
                data: { damageType: 'DAMAGE_TYPE_ANY' }
            }
        ]);
    });
});

describe('active properties', function () {
    it('should heal one point of damage each combat turn', function () {
        const m = new Manager();
        m.loadModule('classic');
        const c1 = m.createEntity(bpNormalActor);
        expect(CONSTS.PROPERTY_REGENERATION in m.propertyBuilder.propertyPrograms).toBeTruthy();

        expect([...m.propertyBuilder.mutatingProperties]).toEqual([CONSTS.PROPERTY_REGENERATION]);
        c1.mutations.setLevel({ value: 10 });
        expect(c1.getters.getAbilities[CONSTS.ABILITY_CONSTITUTION]).toBe(10);
        expect(c1.hitPoints).toBe(17);
        expect(c1.getters.getMaxHitPoints).toBe(35);
        for (let i = 0; i < 100; ++i) {
            m.process();
        }
        expect(c1.getters.getMaxHitPoints).toBe(35);
        const pRegen = m.propertyBuilder.buildProperty({
            type: CONSTS.PROPERTY_REGENERATION,
            amp: 1
        });
        c1.mutations.addProperty({ property: pRegen });

        m.horde.setCreatureActive(c1);
        m.process();
        expect(PropertyBuilder.isPropertyActive(pRegen)).toBeTruthy();
        expect(c1.getters.getProperties.length).toBe(1);
        expect(PropertyBuilder.isPropertyActive(c1.getters.getProperties[0])).toBeTruthy();
        expect(c1.getters.getActiveProperties.length).toBe(1);
        expect(m.horde.isCreatureActive(c1)).toBe(true);

        for (let i = 0; i < 18; ++i) { // about 3 turn -> +3 hp
            m.process();
        }
        expect(c1.hitPoints).toBe(20);
    });

    it('should add vampire as an active creature', function () {
        const m = new Manager();
        m.loadModule('classic');
        const c1 = m.createEntity('c-vampire');
        expect(m.horde.activeCreatures.length).toBe(1);
        m.process();
        m.process();
        m.process();
        m.process();
        m.process();
        m.process();
        m.process();
        m.process();
        m.process();
        expect(m.horde.activeCreatures.length).toBe(1);
        m.destroyEntity(c1);
        expect(m.horde.activeCreatures.length).toBe(0);
    });
});

describe('focus on regeneration', function () {
    it('should prevent regen with struck with radiant damage', function () {
        const m = new Manager();
        m.loadModule('classic');
        const c1 = m.createEntity('c-vampire');
        c1.hitPoints = 10;
        const process = () => {
            m.process();
            m.process();
            m.process();
            m.process();
            m.process();
            m.process();
        };
        process();
        expect(c1.hitPoints).toBe(30);
        expect(c1.getters.getMaxHitPoints).toBe(76);

        process();
        expect(c1.hitPoints).toBe(50);

        process();
        expect(c1.hitPoints).toBe(70);

        process();
        expect(c1.hitPoints).toBe(76);

        process();
        expect(c1.hitPoints).toBe(76);

        c1.hitPoints = 10;
        process();
        expect(c1.hitPoints).toBe(30);

        const eDamage = m.createEffect(CONSTS.EFFECT_DAMAGE, 10, { damageType: CONSTS.DAMAGE_TYPE_RADIANT });
        m.applyEffect(eDamage, c1);

        expect(c1.hitPoints).toBe(10); // don't forget : vulnerable to RADIANT damages = +100% damage

        process();
        expect(c1.hitPoints).toBe(10); // +20 regen - 10 radiant damage of previous damage

        process();
        expect(c1.hitPoints).toBe(30); // +20 regen - 10 radiant damage of previous damage

        process();
        expect(c1.hitPoints).toBe(50); // +20 regen - 10 radiant damage of previous damage
    });
});

describe('testing vampyre effect', function () {
    it('should heal attacker when dealing damage with attacks', function () {
        const m = new Manager();
        m.loadModule('classic');
        const c1 = m.createEntity('c-wight', 'c1');
        c1.hitPoints = 4;
        const c2 = m.createEntity('c-goblin', 'c2');
        c1.dice.cheat(0.9);
        c2.dice.cheat(0.1);
        c1.mutations.selectOffensiveSlot({ value: CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE });
        expect(c1.getters.getSelectedWeapon.blueprint.ref).toBe('wpn-long-sword-wight');
        m.deliverAttack(c1, c2);
        expect(c1.hitPoints).toBeGreaterThan(4);
    });
});

describe('checking if gobs are proficient to their equipment', function () {
    it('gob shoud be proficient with their armor', function () {
        const m = new Manager();
        m.loadModule('classic');
        const g1 = m.createEntity('c-goblin', 'g1');
        expect(g1.getters.isEquipmentProficient[CONSTS.EQUIPMENT_SLOT_CHEST]).toBeTruthy();
        expect(g1.getters.isEquipmentProficient[CONSTS.EQUIPMENT_SLOT_SHIELD]).toBeTruthy();
    });
});
