const CombatManager = require('../src/libs/combat/CombatManager');
const Combat = require('../src/libs/combat/Combat');
const Creature = require('../src/Creature');
const CONSTS = require('../src/consts');
const PropertyBuilder = require('../src/PropertyBuilder');
const EntityBuilder = require('../src/EntityBuilder');
const SCHEMA = require('../src/schemas');
const SchemaValidator = require('../src/SchemaValidator');
const oSchemaValidator = new SchemaValidator();
oSchemaValidator.schemaIndex = SCHEMA;
oSchemaValidator.init();

const bpNormalActor = {
    entityType: CONSTS.ENTITY_TYPE_ACTOR,
    specie: CONSTS.SPECIE_HUMANOID,
    race: CONSTS.RACE_HUMAN,
    ac: 0,
    proficiencies: [],
    speed: 30,
    classType: 'CLASS_TYPE_TOURIST',
    level: 1,
    hd: 6,
    actions: [],
    equipment: []
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

const bpMonster1 = {
    entityType: CONSTS.ENTITY_TYPE_ACTOR,
    specie: CONSTS.SPECIE_MONSTROSITY,
    race: CONSTS.RACE_UNKNOWN,
    ac: 0,
    proficiencies: [],
    speed: 30,
    classType: 'CLASS_TYPE_MONSTER',
    level: 1,
    hd: 6,
    actions: [],
    equipment: [
        'bpClaws2d6',
        'bpFangs3d6'
    ]
};

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
};

const bpArrow = {
    entityType: CONSTS.ENTITY_TYPE_ITEM,
    itemType: CONSTS.ITEM_TYPE_AMMO,
    weight: 0.1,
    properties: [],
    ammoType: 'AMMO_TYPE_ARROW',
    equipmentSlots: [CONSTS.EQUIPMENT_SLOT_AMMO]
};

const bpFist1d3 = {
    entityType: CONSTS.ENTITY_TYPE_ITEM,
    itemType: CONSTS.ITEM_TYPE_WEAPON,
    weight: 0,
    proficiency: CONSTS.PROFICIENCY_WEAPON_NATURAL,
    equipmentSlots: [CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1, CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_2, CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_3],
    damages: '1d3',
    damageType: CONSTS.DAMAGE_TYPE_CRUSHING,
    size: CONSTS.WEAPON_SIZE_SMALL,
    properties: [],
    attributes: []
};

const ebArmCreature = new EntityBuilder();
ebArmCreature.schemaValidator = oSchemaValidator;
ebArmCreature.blueprints = {
    bpFist1d3
};


function armCreature (oCreature) {
    oCreature.equipItem(ebArmCreature.createEntity('bpFist1d3'));
}


describe('isCreatureFighting', function () {
    it('should return false when testing a non fighting creature', function () {
        const cm = new CombatManager();
        const c1 = new Creature({ blueprint: bpNormalActor });
        const c2 = new Creature({ blueprint: bpNormalActor });
        expect(cm.isCreatureFighting(c1)).toBeFalsy();
        expect(cm.isCreatureFighting(c2)).toBeFalsy();
        expect(cm.isCreatureFighting(c1, c2)).toBeFalsy();
        expect(cm.isCreatureFighting(c2, c1)).toBeFalsy();
    });
    it('should return true when testing a fighting creature', function () {
        const cm = new CombatManager();
        const c1 = new Creature({ blueprint: bpNormalActor });
        const c2 = new Creature({ blueprint: bpNormalActor });
        const c3 = new Creature({ blueprint: bpNormalActor });
        cm.startCombat(c1, c2);
        expect(cm.isCreatureFighting(c1)).toBeTruthy();
        expect(cm.isCreatureFighting(c2)).toBeTruthy();
        expect(cm.isCreatureFighting(c1, c2)).toBeTruthy();
        expect(cm.isCreatureFighting(c2, c1)).toBeTruthy();
        expect(cm.isCreatureFighting(c1, c1)).toBeFalsy();
        expect(cm.isCreatureFighting(c2, c2)).toBeFalsy();
        expect(cm.isCreatureFighting(c1, c3)).toBeFalsy();
        expect(cm.isCreatureFighting(c2, c3)).toBeFalsy();
    });
});

describe('getCombat', function () {
    it('should create 2 combat when starting one combat', function () {
        const cm = new CombatManager();
        const c1 = new Creature({ blueprint: bpNormalActor });
        const c2 = new Creature({ blueprint: bpNormalActor });
        expect(cm.combats).toHaveLength(0);
        const combat = cm.startCombat(c1, c2);
        expect(cm.getCombat(c1) === combat).toBeTruthy();
        const combat2 = cm.getCombat(c2);
        expect(cm.getCombat(c2) === combat2).toBeTruthy();
        expect(cm.combats).toHaveLength(2);
    });
});

describe('endCombat', function () {
    it('should destroy a combat when fighter is leaving', function () {
        const cm = new CombatManager();
        const c1 = new Creature({ blueprint: bpNormalActor });
        const c2 = new Creature({ blueprint: bpNormalActor });
        cm.startCombat(c1, c2);
        expect(cm.combats).toHaveLength(2);
        cm.endCombat(c1, true);
        expect(cm.combats).toHaveLength(0);
    });
});

describe('fleeCombat', function () {
    it('should do a parting strike before fleeing combat', function () {
        const eb = new EntityBuilder();
        eb.schemaValidator = oSchemaValidator;
        eb.blueprints = {
            bpNaturalWeapon,
            bpClaws2d6,
            bpFangs3d6,
            bpNormalActor,
            bpMonster1
        };
        const cm = new CombatManager();
        cm.defaultDistance = 5;
        const c1 = eb.createEntity('bpMonster1');
        const c2 = eb.createEntity('bpMonster1');
        const combat = cm.startCombat(c1, c2);
        const logs = [];
        cm.events.on('combat.attack', evt => {
            logs.push(evt);
        });
        expect(cm.isCreatureFighting(c1)).toBeTruthy();
        expect(cm.isCreatureFighting(c2)).toBeTruthy();
        cm.fleeCombat(c2);
        expect(cm.isCreatureFighting(c1)).toBeFalsy();
        expect(cm.isCreatureFighting(c2)).toBeFalsy();
        expect(logs.length).toBe(1);
        expect(logs[0].combat === combat).toBeTruthy();
        expect(logs[0].combat.attacker).toBe(c1);
        expect(logs[0].combat.target).toBe(c2);
        expect(logs[0].count).toBe(1);
        expect(logs[0].opportunity).toBeTruthy();
    });
});

describe('advancing combat', function () {
    const eb = new EntityBuilder();
    eb.schemaValidator = oSchemaValidator;
    const pb = new PropertyBuilder();
    it('should produce two events (one per combat) when processing combat 6 times', function () {
        const cm = new CombatManager();
        const c1 = new Creature({ blueprint: bpNormalActor, id: 'c1' });
        const c2 = new Creature({ blueprint: bpNormalActor, id: 'c2' });
        armCreature(c1);
        armCreature(c2);
        cm.startCombat(c1, c2);
        const logs = [];
        cm.events.on('combat.attack', evt => {
            logs.push({
                attacker: evt.combat.attacker.id,
                target: evt.combat.target.id,
                turn: evt.combat.turn,
                tick: evt.combat.tick
            });
        });
        cm.processCombats(); // tick 0
        cm.processCombats(); // tick 1
        cm.processCombats(); // tick 2
        cm.processCombats(); // tick 3
        cm.processCombats(); // tick 4
        expect(logs).toEqual([]);
        cm.processCombats(); // tick 5 --- event !
        expect(logs).toEqual([
            { attacker: 'c1', target: 'c2', turn: 0, tick: 5 },
            { attacker: 'c2', target: 'c1', turn: 0, tick: 5 }
        ]);
    });
    it('should produce more events when having extra attack bonus', function () {
        const cm = new CombatManager();
        const c1 = new Creature({ blueprint: bpNormalActor, id: 'c1' });
        const c2 = new Creature({ blueprint: bpNormalActor, id: 'c2' });
        armCreature(c1);
        armCreature(c2);
        c1.mutations.addProperty({ property: pb.buildProperty({
            type: CONSTS.PROPERTY_ATTACK_COUNT_MODIFIER,
            amp: 1
        })});
        const combat = cm.startCombat(c1, c2);
        const logs = [];
        cm.events.on('combat.attack', evt => {
            logs.push({
                attacker: evt.combat.attacker.id,
                target: evt.combat.target.id,
                turn: evt.combat.turn,
                tick: evt.combat.tick
            });
        });
        cm.processCombats(); // tick 0
        cm.processCombats(); // tick 1
        cm.processCombats(); // tick 2
        cm.processCombats(); // tick 3 --- event
        expect(combat.attacker.getters.getProperties).toHaveLength(1);
        expect(combat.attackerState.getRangedExtraAttackCount()).toBe(1);
        expect(combat.attackerState.getMeleeExtraAttackCount()).toBe(1);
        expect(combat.attackerState.attackCount).toBe(2);
        expect(combat.attackerState.plan).toEqual([0, 0, 1, 0, 0, 1]);
        expect(logs).toEqual([
            { attacker: 'c1', target: 'c2', turn: 0, tick: 2 }
        ]);
        cm.processCombats(); // tick 4
        cm.processCombats(); // tick 5 --- event !
        expect(logs).toEqual([
            { attacker: 'c1', target: 'c2', turn: 0, tick: 2 },
            { attacker: 'c1', target: 'c2', turn: 0, tick: 5 },
            { attacker: 'c2', target: 'c1', turn: 0, tick: 5 }
        ]);
    });
    it('both creatures should rush toward each other when combat start at distance 50 and having no weapon but natural weapon', function () {
        const cm = new CombatManager();
        expect(cm.defaultDistance).toBe(0);
        cm.defaultDistance = 50;
        expect(cm.defaultDistance).toBe(50);
        const c1 = new Creature({ blueprint: bpNormalActor, id: 'c1' });
        const c2 = new Creature({ blueprint: bpNormalActor, id: 'c2' });
        cm.startCombat(c1, c2);
        const logs = [];
        cm.events.on('combat.attack', evt => {
            logs.push({
                type: 'combat.attack',
                attacker: evt.combat.attacker.id,
                target: evt.combat.target.id,
                turn: evt.combat.turn,
                tick: evt.combat.tick
            });
        });
        cm.events.on('combat.distance', evt => {
            logs.push({
                type: 'combat.distance',
                attacker: evt.combat.attacker.id,
                target: evt.combat.target.id,
                turn: evt.combat.turn,
                tick: evt.combat.tick,
                previousDistance: evt.previousDistance,
                distance: evt.distance
            });
        });
        cm.processCombats(); // tick 0
        expect(logs).toEqual([
            {
                type: 'combat.distance',
                attacker: 'c1',
                target: 'c2',
                turn: 0,
                tick: 0,
                previousDistance: 50,
                distance: 20
            },
            {
                type: 'combat.distance',
                attacker: 'c2',
                target: 'c1',
                turn: 0,
                tick: 0,
                previousDistance: 20,
                distance: 5
            }
        ]);
    });
    it('c1 should attack c2 with ranged weapon and c2 should rush toward c1 when c1 has bow and c2 has no ranged weapon', function () {
        const cm = new CombatManager();
        expect(cm.defaultDistance).toBe(0);
        cm.defaultDistance = 50;
        expect(cm.defaultDistance).toBe(50);
        const c1 = new Creature({ blueprint: bpNormalActor, id: 'c1' });
        const c2 = new Creature({ blueprint: bpNormalActor, id: 'c2' });
        c1.equipItem(eb.createEntity(bpShortbow));
        c1.equipItem(eb.createEntity(bpArrow));
        const combat = cm.startCombat(c1, c2);
        const logs = [];
        cm.events.on('combat.attack', evt => {
            logs.push({
                type: 'combat.attack',
                attacker: evt.combat.attacker.id,
                target: evt.combat.target.id,
                turn: evt.combat.turn,
                tick: evt.combat.tick
            });
        });
        cm.events.on('combat.distance', evt => {
            logs.push({
                type: 'combat.distance',
                attacker: evt.combat.attacker.id,
                target: evt.combat.target.id,
                turn: evt.combat.turn,
                tick: evt.combat.tick,
                previousDistance: evt.previousDistance,
                distance: evt.distance
            });
        });
        cm.processCombats(); // tick 0
        expect(logs).toEqual([{ // c2 rushes toward c1
            type: 'combat.distance',
            attacker: 'c2',
            target: 'c1',
            turn: 0,
            tick: 0,
            previousDistance: 50,
            distance: 20
        }]);
        cm.processCombats(); // tick 1
        cm.processCombats(); // tick 2
        cm.processCombats(); // tick 3
        cm.processCombats(); // tick 4

        expect(logs).toEqual([{
            type: 'combat.distance',
            attacker: 'c2',
            target: 'c1',
            turn: 0,
            tick: 0,
            previousDistance: 50,
            distance: 20
        }]);

        cm.processCombats(); // tick 5

        expect(logs).toEqual([
            {
                type: 'combat.distance',
                attacker: 'c2',
                target: 'c1',
                turn: 0,
                tick: 0,
                previousDistance: 50,
                distance: 20
            },
            {
                attacker: 'c1',
                target: 'c2',
                tick: 5,
                turn: 0,
                type: 'combat.attack'
            }
        ]);

        expect(combat.distance).toBe(20);

    });
    it('should not cast an action when not calling nextAction', function () {
        const cm = new CombatManager();
        cm.defaultDistance = 50;
        const c1 = new Creature({ blueprint: bpNormalActor, id: 'c1' });
        const c2 = new Creature({ blueprint: bpNormalActor, id: 'c2' });
        cm.startCombat(c1, c2);
        const logs = [];
        cm.events.on('combat.action', evt => {
            logs.push({
                type: 'combat.attack',
                attacker: evt.combat.attacker.id,
                target: evt.combat.target.id,
                turn: evt.combat.turn,
                tick: evt.combat.tick
            });
        });
        cm.processCombats();
        cm.processCombats();
        cm.processCombats();
        cm.processCombats();
        cm.processCombats();
        cm.processCombats();
        cm.processCombats();
        cm.processCombats();
        cm.processCombats();
        cm.processCombats();
        cm.processCombats();
        cm.processCombats();
        cm.processCombats();
        cm.processCombats();
        cm.processCombats();
        cm.processCombats();
        cm.processCombats();
        cm.processCombats();
        cm.processCombats();
        cm.processCombats();
        cm.processCombats();
        cm.processCombats();
        cm.processCombats();
        cm.processCombats();
        cm.processCombats();
        cm.processCombats();
        cm.processCombats();
        cm.processCombats();
        cm.processCombats();
        cm.processCombats();
        cm.processCombats();
        cm.processCombats();
        expect(logs).toHaveLength(0);
    });
    it('should set nextTurn action when calling selectAction twice in the same turn', function () {
        const cm = new CombatManager();
        cm.defaultDistance = 50;
        const c1 = new Creature({ blueprint: bpNormalActor, id: 'c1' });
        const c2 = new Creature({ blueprint: bpNormalActor, id: 'c2' });
        const combat = cm.startCombat(c1, c2);
        expect(combat.distance).toBe(50);
        combat.attacker.mutations.defineAction({
            id: 'a1',
            actionType: CONSTS.COMBAT_ACTION_TYPE_SPELL_LIKE_ABILITY,
            script: 'script1'
        });
        const logs = [];
        cm.events.on('combat.action', evt => {
            logs.push({
                type: 'combat.attack',
                attacker: evt.combat.attacker.id,
                target: evt.combat.target.id,
                turn: evt.combat.turn,
                tick: evt.combat.tick,
                action: evt.action
            });
        });
        expect(combat.distance).toBe(50);
        expect(cm.combats).toHaveLength(2);

        cm.processCombats(); // turn 0 : tick 0->1
        // Only c2 will move as it is out of range
        expect(combat.attackerState.actions['a1'].ready).toBeTruthy();
        expect(combat.attackerState.actions['a1'].range).toBeGreaterThan(combat.distance);
        expect(combat.currentAction.id).toBe('a1');
        expect(combat.distance).toBe(20);
        expect(combat.tick).toBe(1);
        expect(logs).toHaveLength(0);

        cm.processCombats(); // turn 0 : tick 1->2

        cm.processCombats(); // turn 0 : tick 2->3

        // Current : a1
        // Next : null
        expect(combat.nextTurnAction).toBeNull();
        expect(combat.currentAction).not.toBeNull();
        expect(combat.currentAction.id).toBe('a1');
        expect(combat.attackerState.hasTakenAction()).toBeFalsy(); // Action still not used
        expect(combat.attackerState.actions['a1'].ready).toBeTruthy();

        combat.selectAction('a1'); // reselecting a1 : should be put in next turn action because current action still going on
        // because action has not fired yet
        expect(combat.nextTurnAction).not.toBeNull();
        expect(combat.nextTurnAction.id).toBe('a1');
        expect(combat.currentAction).not.toBeNull();



        expect(logs).toHaveLength(0);
        expect(combat.tick).toBe(3);

        cm.processCombats(); // turn 0 : tick 3->4
        expect(logs).toHaveLength(0);

        cm.processCombats(); // turn 0 : tick 4->5
        expect(logs).toHaveLength(0);
        expect(combat.distance).toBe(20);
        expect(combat.getSelectedWeaponRange()).toBe(-1); // Absolutely no weapon (natural or other)
        expect(combat.isTargetInRange()).toBeTruthy();

        cm.processCombats(); // turn 0->1 : tick 5->0 !! new turn, selecting new action
        // now nextTurnAction should be null
        expect(combat.nextTurnAction).toBeNull();
        expect(combat.currentAction).not.toBeNull();

        cm.processCombats(); // // turn 1 : tick 0->1 !! beginning of tick 0 : taking action
        expect(logs).toHaveLength(1);
        const l0 = logs[0].action;
        expect(l0.id).toBe('a1');
    });
    it('should not select and use action when target is too far for action range', function () {
        const cm = new CombatManager();
        cm.defaultDistance = 1000;
        const c1 = new Creature({ blueprint: bpNormalActor, id: 'c1' });
        const c2 = new Creature({ blueprint: bpNormalActor, id: 'c2' });
        const combat = cm.startCombat(c1, c2);
        combat.attacker.mutations.defineAction({
            id: 'a1',
            actionType: CONSTS.COMBAT_ACTION_TYPE_SPELL_LIKE_ABILITY,
            script: 'script1',
            range: 5
        });
        const logs = [];
        cm.events.on('combat.action', ev => logs.push({
            type: 'action',
            action: ev.action.id
        }));
        expect(combat.distance).toBe(1000);

        cm.processCombats(); // turn 0 : tick 0->1
        expect(combat.distance).toBe(30); // MAX_COMBAT_DISTANCE - target speed

        cm.processCombats(); // turn 0 : tick 1->2
        cm.processCombats(); // turn 0 : tick 2->3
        cm.processCombats(); // turn 0 : tick 3->4
        cm.processCombats(); // turn 0 : tick 4->5
        combat.selectAction('a1');
        cm.processCombats(); // turn 0->1 : tick 5->0
        expect(combat.currentAction).toBeNull(); // action range is far to short than combat distance

        expect(logs).toHaveLength(0);
        cm.processCombats(); // turn 1 : tick 0->1
        expect(combat.currentAction).toBeNull();
        expect(combat.distance).toBe(5);
        expect(combat.currentAction).toBeNull();
        expect(logs).toHaveLength(0);
        cm.processCombats(); // turn 1 : tick 1->2
        cm.processCombats(); // turn 1 : tick 2->3
        cm.processCombats(); // turn 1 : tick 3->4
        cm.processCombats(); // turn 1 : tick 4->5
        expect(combat.currentAction).toBeNull();
        cm.processCombats(); // turn 1->2 : tick 5->0
        expect(combat.currentAction).toBeNull();
        cm.processCombats(); // turn 2 : tick 0->1
        expect(combat.currentAction).not.toBeNull();
    });
});

describe('Try real combat', function () {
    it('should work in real combat', function () {
        const cm = new CombatManager();
        cm.defaultDistance = 50;
        const c1 = new Creature({ blueprint: bpNormalActor, id: 'c1' });
        const c2 = new Creature({ blueprint: bpNormalActor, id: 'c2' });
        cm.startCombat(c1, c2);
        c1.mutations.defineAction({
            id: 'a1',
            actionType: CONSTS.COMBAT_ACTION_TYPE_SPELL_LIKE_ABILITY,
            script: 'script1',
            range: 5
        });
        c2.mutations.defineAction({
            id: 'a2',
            actionType: CONSTS.COMBAT_ACTION_TYPE_SPELL_LIKE_ABILITY,
            script: 'script2',
            range: 5
        });
        const logs = [];
        cm.events.on('combat.move', ({
            previousDistance,
            speed
        }) => {
            logs.push({
                type: 'move',
                previousDistance,
                speed
            });
        });
        cm.processCombats();
        expect(logs).toHaveLength(2);
    });
});

describe('combat vs monster with claws and fangs', function () {
    it('should not select weapon when target is out of range and not having ranged weapon', function () {
        const eb = new EntityBuilder();
        eb.schemaValidator = oSchemaValidator;
        eb.blueprints = {
            bpNaturalWeapon,
            bpClaws2d6,
            bpFangs3d6,
            bpNormalActor,
            bpMonster1
        };
        const cm = new CombatManager();
        cm.defaultDistance = 50;
        const c1 = eb.createEntity('bpNormalActor', 'c1');
        const c2 = eb.createEntity('bpMonster1', 'c2');
        c2.dice.cheat(0.01);
        expect(c2.getters.getEquipment[CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1]).not.toBeNull();
        expect(c2.getters.getEquipment[CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_2]).not.toBeNull();
        expect(c2.getters.getEquipment[CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_3]).toBeNull();

        const oCombat = cm.startCombat(c2, c1);
        expect(oCombat.distance).toBe(50);
        expect(oCombat.getMostSuitableSlot()).toBe('');
    });
    it('should select a natural weapon when attacking', function () {
        const eb = new EntityBuilder();
        eb.schemaValidator = oSchemaValidator;
        eb.blueprints = {
            bpNaturalWeapon,
            bpClaws2d6,
            bpFangs3d6,
            bpNormalActor,
            bpMonster1
        };
        const cm = new CombatManager();
        cm.defaultDistance = 50;
        const c1 = eb.createEntity('bpNormalActor', 'c1');
        const c2 = eb.createEntity('bpMonster1', 'c2');
        c2.dice.cheat(0.01);
        expect(c2.getters.getEquipment[CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1]).not.toBeNull();
        expect(c2.getters.getEquipment[CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_2]).not.toBeNull();
        expect(c2.getters.getEquipment[CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_3]).toBeNull();

        const oCombat = cm.startCombat(c2, c1);
        oCombat.distance = 5;
        expect(oCombat.distance).toBe(5);
        expect(oCombat.getMostSuitableSlot()).toBe(CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_1);

        c2.dice.cheat(0.99);
        expect(oCombat.getMostSuitableSlot()).toBe(CONSTS.EQUIPMENT_SLOT_NATURAL_WEAPON_2);
    });
});

describe('problème des zone d effet', function () {
    it('distance should be 50 when starting combat', function () {
        const cm = new CombatManager();
        cm.defaultDistance = 50;
        const c1 = new Creature({ blueprint: bpNormalActor });
        const c2 = new Creature({ blueprint: bpNormalActor });
        const c3 = new Creature({ blueprint: bpNormalActor });
        const c4 = new Creature({ blueprint: bpNormalActor });
        const c5 = new Creature({ blueprint: bpNormalActor });
        const c6 = new Creature({ blueprint: bpNormalActor });

        // c1 is fighting c2 .. c6
        /**
         * @type {Combat}
         */
        const cb2 = cm.startCombat(c2, c1);
        const cb3 = cm.startCombat(c3, c1);
        const cb4 = cm.startCombat(c4, c1);
        const cb5 = cm.startCombat(c5, c1);
        const cb6 = cm.startCombat(c6, c1);

        expect(cb2).toBeInstanceOf(Combat);
        expect(cb2).toHaveProperty('distance');
        expect(cb2.distance).toBe(50);
    });
});

describe('combat distance', function () {
    it('target fighting back should create a combat with same distance', function () {
        const cm = new CombatManager();
        cm.defaultDistance = 50;
        const c1 = new Creature({ blueprint: bpNormalActor });
        const c2 = new Creature({ blueprint: bpNormalActor });
        const c3 = new Creature({ blueprint: bpNormalActor });

        const cb2 = cm.startCombat(c2, c3);
        const cb1 = cm.startCombat(c1, c2);

        expect(cb1.distance).toBe(50);
        expect(cb2.distance).toBe(50);

        cb1.distance = 30;
        cm.endCombat(c2, true);

        expect(cm.isCreatureFighting(c2)).toBeFalsy();
        expect(cm.isCreatureFighting(c3)).toBeFalsy();


    });
});
