const API = require('../src/API');
const BoxedCreature = require('../src/sub-api/classes/BoxedCreature');
const BoxedObject = require('../src/sub-api/classes/BoxedObject');
const Creature = require('../src/Creature');
const CONSTS = require('../src/consts');

beforeEach(function () {
    BoxedObject.resetMap();
});

describe('BoxedCreature', () => {
    it('should return same boxed creature instance when submitting the same creature', function () {
        const api = new API();
        api.services.core.loadModule('classic');
        const c1 = new Creature();
        const c2 = new Creature();
        const b10 = new BoxedCreature(c1);
        const b11 = new BoxedCreature(c1);
        const b20 = new BoxedCreature(c2);
        expect(b10).toBe(b11);
        expect(b20).not.toBe(b10);
    });
});

describe('entities', function () {
    describe('createEntity', function () {
        it('should create a boxed entity', function () {
            const api = new API();
            api.services.core.loadModule('classic');
            const oGoblin = api.services.entities.createEntity('c-goblin', 'c1');
            expect(oGoblin).toBeInstanceOf(BoxedCreature);
        });

        it('should not create an entity when resref is invalid', function () {
            const api = new API();
            expect(() => api.services.entities.createEntity('c-goblin', 'c1'))
                .toThrowError(new ReferenceError('This blueprint does not exist c-goblin'));
        });

        it('should register one boxedCreature and 5 BoxedItem when creating a goblin (with equipment)', function () {
            const api = new API();
            api.services.core.loadModule('classic');
            expect(BoxedObject.instanceMapCount).toBe(0);
            const c1 = api.services.entities.createEntity('c-goblin', 'c1');
            expect(BoxedObject.instanceMapCount).toBe(6); // gob + equipment
            api.services.entities.destroyEntity(c1);
            expect(BoxedObject.instanceMapCount).toBe(0);
        });
    });

    describe('destroyEntity', function () {
        it('should destroy an existing entity', function () {
            const api = new API();
            api.services.core.loadModule('classic');
            const oGoblin = api.services.entities.createEntity('c-goblin', 'c1');
            expect(oGoblin).toBeInstanceOf(BoxedCreature);
            expect(oGoblin.id).toBe('c1');
            expect(api.services.entities.entityExists(oGoblin.id)).toBeTruthy();
            api.services.entities.destroyEntity(oGoblin);
            expect(api.services.entities.entityExists(oGoblin.id)).toBeFalsy();
        });

        it('should not throw an error when destroying the same entity twice', function () {
            const api = new API();
            api.services.core.loadModule('classic');
            const oGoblin = api.services.entities.createEntity('c-goblin', 'c1');
            api.services.entities.destroyEntity(oGoblin);
            expect(() => {
                api.services.entities.destroyEntity(oGoblin);
            }).not.toThrow();
        });
    });

    describe('switchEntityType', function () {
        it('should switch ', function () {
            const api = new API();
            api.services.core.loadModule('classic');
            const oGoblin = api.services.entities.createEntity('c-goblin', 'c1');
            const oSword = api.services.entities.createEntity('wpn-short-sword', 'sw1');
            const r1 = api.services.entities.switchEntityType(oGoblin, {
                creature: creature => 'creature-' + creature.id,
                item: item => 'item-' + item.id
            });
            const r2 = api.services.entities.switchEntityType(oSword, {
                creature: creature => 'creature-' + creature.id,
                item: item => 'item-' + item.id
            });
            expect(r1).toBe('creature-c1');
            expect(r2).toBe('item-sw1');
        });
    });

    describe('what happens when creating creature with equipment', function () {
        it('should return 6 when creating goblin with equipment (one creature and 5 items)', function () {
            const api = new API();
            api.services.core.loadModule('classic');
            const oGoblin = api.services.entities.createEntity('c-goblin', 'c1');
            expect(BoxedObject.instanceMapCount).toBe(6);
            const i1 = api.services.creatures.getEquipment(oGoblin, CONSTS.EQUIPMENT_SLOT_WEAPON_MELEE);
            const i2 = api.services.creatures.getEquipment(oGoblin, CONSTS.EQUIPMENT_SLOT_CHEST);
            const i3 = api.services.creatures.getEquipment(oGoblin, CONSTS.EQUIPMENT_SLOT_SHIELD);
            expect(i1).not.toBeNull();
            expect(i2).not.toBeNull();
            expect(i3).not.toBeNull();
            expect(BoxedObject.instanceMapCount).toBe(6);
        });
        it('should destroy all item created when goblin is created', function () {
            const api = new API();
            api.services.core.loadModule('classic');
            const oGoblin = api.services.entities.createEntity('c-goblin', 'c1');
            expect(BoxedObject.instanceMapCount).toBe(6);
            api.services.entities.destroyEntity(oGoblin);
            expect(BoxedObject.instanceMapCount).toBe(0); // all equipped items destroyed from instanceMap
        });
    });
});

describe('creatures', function () {
    describe('isCreature', function () {
        it('should return false when submitting an irrelevant object', function () {
            const api = new API();
            expect(api.services.creatures.isCreature(null)).toBeFalsy();
            expect(api.services.creatures.isCreature(undefined)).toBeFalsy();
            expect(api.services.creatures.isCreature(new Creature())).toBeFalsy();
        });
        it('should return true when submitting valid boxed creature', function () {
            const api = new API();
            api.services.core.loadModule('classic');
            const c1 = new BoxedCreature(new Creature());
            const c2 = api.services.entities.createEntity('c-goblin', 'c1');
            expect(api.services.creatures.isCreature(c1)).toBeTruthy();
            expect(api.services.creatures.isCreature(c2)).toBeTruthy();
        });
    });

    describe('getAbilityModifier / getAbilityScore', function () {
        it('should return 1 when asking for goblin dexterity', function () {
            const api = new API();
            api.services.core.loadModule('classic');
            const c1 = api.services.entities.createEntity('c-goblin', 'c1');
            expect(api.services.creatures.getAbilityScore(c1, api.services.core.CONSTS.ABILITY_DEXTERITY)).toBe(14);
            expect(api.services.creatures.getAbilityModifier(c1, api.services.core.CONSTS.ABILITY_DEXTERITY)).toBe(2);
        });
    });

    describe('getActions', function () {
        it('should return an array of actions for creature', function () {
            const api = new API();
            api.services.core.loadModule('classic');
            const c1 = api.services.entities.createEntity('c-dragon-red', 'c1');
            const actions = api.services.creatures.getActions(c1);
            expect(Object.values(actions).length).toBe(3);
            expect(Object.keys(actions).sort()).toEqual([
                'act-elemental-breath',
                'act-frightful-roar',
                'act-wing-buffet',
            ]);
        });
    });
    describe('hasCapability', function () {
        it('should return an array of capabilities for creature with no conditions', function () {
            const api = new API();
            api.services.core.loadModule('classic');
            const c1 = api.services.entities.createEntity('c-goblin', 'c1');
            expect(api.services.creatures.hasCapability(c1, CONSTS.CAPABILITY_SEE)).toBeTruthy();
        });
        it('should throw an error when capability is invalid', function () {
            const api = new API();
            api.services.core.loadModule('classic');
            const c1 = api.services.entities.createEntity('c-goblin', 'c1');
            expect(() => api.services.creatures.hasCapability(c1, CONSTS.ABILITY_DEXTERITY)).toThrow();
        });
        it('should not have capability SEE when blinded', function () {
            const api = new API();
            api.services.core.loadModule('classic');
            const c1 = api.services.entities.createEntity('c-goblin', 'c1');
            expect(api.services.creatures.hasCapability(c1, CONSTS.CAPABILITY_SEE)).toBeTruthy();
            const eBlindness = api.services.effects.createEffect(CONSTS.EFFECT_BLINDNESS);
            api.services.effects.applyEffect(eBlindness, c1, 10);
            expect(api.services.creatures.hasCapability(c1, CONSTS.CAPABILITY_SEE)).toBeFalsy();
        });
        it('should get capability SEE back when blinded and removing blindness', function () {
            const api = new API();
            api.services.core.loadModule('classic');
            const c1 = api.services.entities.createEntity('c-goblin', 'c1');
            expect(api.services.creatures.hasCapability(c1, CONSTS.CAPABILITY_SEE)).toBeTruthy();
            const eBlindness = api.services.effects.createEffect(CONSTS.EFFECT_BLINDNESS);
            api.services.effects.applyEffect(eBlindness, c1, 10);
            expect(api.services.creatures.hasCapability(c1, CONSTS.CAPABILITY_SEE)).toBeFalsy();
            const aEffectBlindness = api.services.effects.findEffects(c1, CONSTS.EFFECT_BLINDNESS);
            aEffectBlindness.forEach(effect => {
                api.services.effects.dispellEffect(effect);
            });
            expect(api.services.creatures.hasCapability(c1, CONSTS.CAPABILITY_SEE)).toBeTruthy();
        });
    });

    describe('hasConditions / getConditions', function () {
        it('should return no condition when creature has no effect', function () {
            const api = new API();
            api.services.core.loadModule('classic');
            const c1 = api.services.entities.createEntity('c-goblin', 'c1');
            expect(api.services.creatures.hasConditions(c1, CONSTS.CONDITION_BLINDED)).toBeFalsy();
            const eBlindness = api.services.effects.createEffect(CONSTS.EFFECT_BLINDNESS);
            const eParalysis = api.services.effects.createEffect(CONSTS.EFFECT_PARALYSIS);
            const eDamage = api.services.effects.createEffect(CONSTS.EFFECT_DAMAGE, '1d3', { damageType: CONSTS.DAMAGE_TYPE_POISON });
            api.services.effects.applySpellEffectGroup('spell1', [
                eBlindness, eParalysis, eDamage
            ], c1, 10);
            expect(api.services.creatures.hasConditions(c1, CONSTS.CONDITION_DISEASE)).toBeFalsy();
            expect(api.services.creatures.hasConditions(c1, CONSTS.CONDITION_BLINDED)).toBeTruthy();
            expect(api.services.creatures.hasConditions(c1, CONSTS.CONDITION_FRIGHTENED)).toBeFalsy();
            expect(api.services.creatures.hasConditions(c1, CONSTS.CONDITION_PARALYZED)).toBeTruthy();
            expect(api.services.creatures.hasConditions(c1, CONSTS.CONDITION_POISONED)).toBeTruthy();
            expect(api.services.creatures.getConditions(c1).sort()).toEqual([
                CONSTS.CONDITION_BLINDED, CONSTS.CONDITION_PARALYZED, CONSTS.CONDITION_POISONED
            ]);
        });
    });

    describe('getWeight / getMaxCarryWeight', function () {
        it('should return no weight when creature has no equipped item', function () {
            const api = new API();
            api.services.core.loadModule('classic');
            const c1 = api.services.entities.createEntity('c-griffon', 'c1');
            expect(api.services.creatures.getEquipmentWeight(c1)).toBe(0);
            expect(api.services.creatures.getMaxEquipmentWeight(c1)).toBe(200);
        });
    });
});
