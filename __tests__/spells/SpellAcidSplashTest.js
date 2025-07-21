const Manager = require('../../src/Manager');
const CONSTS = require('../../src/consts');

describe('Acid Splash', function () {
    it('should cast acid splash spell and deal 6 acid damage on unaware target', function () {
        const m = new Manager();
        const aLog = [];
        m.events.on(CONSTS.EVENT_CREATURE_DAMAGED, (evt) => {
            aLog.push(`creature ${evt.creature.id} damaged by ${evt.source.id}: ${evt.amount} ${evt.damageType}`);
        });
        m.events.on(CONSTS.EVENT_CREATURE_SAVING_THROW,
            /**
             * @param evt {CreatureSavingThrowEvent}
             */
            (evt) => {
                aLog.push(`creature ${evt.creature.id} saving throw against ${evt.ability} roll ${evt.roll} vs. ${evt.dc}`);
            }
        );
        m.loadModule('classic');
        m.loadModule('magic');
        const c1 = m.createEntity('c-orc', 'orc1');
        const c2 = m.createEntity('c-orc', 'orc2');
        c1.dice.cheat(0.9);
        c2.dice.cheat(0.1);
        const r = m.castSpell('acid-splash', c1, c2, { freeCast: true });
        expect(r.reason).toBe('');
        expect(r.success).toBeTruthy();
        expect(aLog).toEqual([
            'creature orc2 saving throw against ABILITY_DEXTERITY roll 3 vs. 10',
            'creature orc2 damaged by orc1: 6 DAMAGE_TYPE_ACID'
        ]);
    });

    it('should not hit more than one creature when they are unaware of caster (not in combat)', function () {
        const m = new Manager();
        const aLog = [];
        m.events.on(CONSTS.EVENT_CREATURE_DAMAGED, (evt) => {
            aLog.push(`creature ${evt.creature.id} damaged by ${evt.source.id}: ${evt.amount} ${evt.damageType}`);
        });
        m.loadModule('classic');
        m.loadModule('magic');
        const c1 = m.createEntity('c-orc', 'orc1');
        const c2 = m.createEntity('c-orc', 'orc2');
        const c3 = m.createEntity('c-orc', 'orc3');
        c1.dice.cheat(0.9);
        c2.dice.cheat(0.1);
        c3.dice.cheat(0.1);
        const r = m.castSpell('acid-splash', c1, c2, { freeCast: true });
        expect(r.reason).toBe('');
        expect(r.success).toBeTruthy();
        expect(aLog).toEqual([
            'creature orc2 damaged by orc1: 6 DAMAGE_TYPE_ACID'
        ]);
    });

    it('should hit more than one creature when they are fighting caster', function () {
        const m = new Manager();
        m.combatManager.defaultDistance = 50;
        const aLog = [];
        m.events.on(CONSTS.EVENT_CREATURE_DAMAGED, (evt) => {
            aLog.push(`creature ${evt.creature.id} damaged by ${evt.source.id}: ${evt.amount} ${evt.damageType}`);
        });
        m.loadModule('classic');
        m.loadModule('magic');
        m.initFactions();
        const c1 = m.createEntity('c-orc', 'orc1');
        const c2 = m.createEntity('c-orc', 'orc2');
        const c3 = m.createEntity('c-orc', 'orc3');
        m.horde.setCreatureFaction(c1, 'player');
        m.horde.setCreatureFaction(c2, 'hostile');
        m.horde.setCreatureFaction(c3, 'hostile');
        m.horde.setCreatureLocation(c1, 'r1');
        m.horde.setCreatureLocation(c2, 'r1');
        m.horde.setCreatureLocation(c3, 'r1');
        m.startCombat(c1, c2);
        m.startCombat(c3, c1);
        m.combatManager.getCombat(c1).approachTarget(30);
        m.combatManager.getCombat(c3).approachTarget(30);
        c1.dice.cheat(0.9);
        c2.dice.cheat(0.1);
        c3.dice.cheat(0.1);
        const r = m.castSpell('acid-splash', c1, c2, { freeCast: true });
        expect(r.reason).toBe('');
        expect(r.success).toBeTruthy();
        expect(m.getCreatureDistance(c1, c3)).toBe(20);
        expect(m.getCreatureDistance(c1, c2)).toBe(20);
        expect(m.getHostileCreatures(c1).map(c => c.id).includes('orc2')).toBeTruthy();
        expect(m.getHostileCreatures(c1).map(c => c.id).includes('orc3')).toBeTruthy();
        expect(aLog).toEqual([
            'creature orc2 damaged by orc1: 6 DAMAGE_TYPE_ACID',
            'creature orc3 damaged by orc1: 6 DAMAGE_TYPE_ACID'
        ]);
    });

    it('should not hit orc3 when orc3 is too far', function () {
        const m = new Manager();
        m.combatManager.defaultDistance = 50;
        const aLog = [];
        m.events.on(CONSTS.EVENT_CREATURE_DAMAGED, (evt) => {
            aLog.push(`creature ${evt.creature.id} damaged by ${evt.source.id}: ${evt.amount} ${evt.damageType}`);
        });
        m.loadModule('classic');
        m.loadModule('magic');
        m.initFactions();
        const c1 = m.createEntity('c-orc', 'orc1');
        const c2 = m.createEntity('c-orc', 'orc2');
        const c3 = m.createEntity('c-orc', 'orc3');
        m.horde.setCreatureFaction(c1, 'player');
        m.horde.setCreatureFaction(c2, 'hostile');
        m.horde.setCreatureFaction(c3, 'hostile');
        m.horde.setCreatureLocation(c1, 'r1');
        m.horde.setCreatureLocation(c2, 'r1');
        m.horde.setCreatureLocation(c3, 'r1');
        m.startCombat(c1, c2);
        m.startCombat(c3, c1);
        m.combatManager.getCombat(c1).approachTarget(30);
        c1.dice.cheat(0.9);
        c2.dice.cheat(0.1);
        c3.dice.cheat(0.1);
        const r = m.castSpell('acid-splash', c1, c2, { freeCast: true });
        expect(r.reason).toBe('');
        expect(r.success).toBeTruthy();
        expect(m.getCreatureDistance(c1, c3)).toBe(50);
        expect(m.getCreatureDistance(c1, c2)).toBe(20);
        expect(aLog).toEqual([
            'creature orc2 damaged by orc1: 6 DAMAGE_TYPE_ACID'
        ]);
    });
});
