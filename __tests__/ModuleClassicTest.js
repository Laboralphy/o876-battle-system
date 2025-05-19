const Manager = require('../src/Manager');
const CONSTS = require('../src/consts');

describe('assigning feat to creature', function () {
    it('should not have feat fighting style great weapon when creating orc', function () {
        const m = new Manager();
        m.loadModule('classic');
        const c = m.createEntity('c-orc');
        expect(m.hasFeat(c, 'FEAT_FIGHTING_STYLE_GREAT_WEAPON')).toBeFalsy();
    });
    it('should have feat fighting style great weapon when creating orc and adding this feat', function () {
        const m = new Manager();
        m.loadModule('classic');
        const c = m.createEntity('c-orc');
        m.addCreatureFeat(c, 'FEAT_FIGHTING_STYLE_GREAT_WEAPON');
        expect(m.hasFeat(c, 'FEAT_FIGHTING_STYLE_GREAT_WEAPON')).toBeTruthy();
    });
});

describe('fighter feat fighting style great weapon', function () {
    it('should not attack twice when attack roll is > 2', function () {
        const m = new Manager();
        m.loadModule('classic');
        const aLog1 = [];
        const pNewScript = function ({ property, manager, creature, target, attack }) {
            const nPrevRoll = attack.roll;
            const cg = creature.getters;
            let b = false;
            if (!!attack.weapon && cg.isWieldingTwoHandedWeapon && attack.attackType === CONSTS.ATTACK_TYPE_MELEE) {
                if (!attack.hit && attack.roll <= 2) {
                    b = true;
                    attack.attack();
                }
            }
            aLog1.push(b ? `reroll attack ${nPrevRoll} -> ${attack.roll}` : `do NOT reroll attack ${attack.roll}`);
        };
        m.defineModule({
            scripts: {
                'at-ffs-great-weapon-second-chance': pNewScript
            }
        });
        const c = m.createEntity('c-orc');
        m.addCreatureFeat(c, 'FEAT_FIGHTING_STYLE_GREAT_WEAPON');
        const w = m.createEntity('wpn-great-axe');
        c.equipItem(w);
        expect(c.getters.getEquipment[CONSTS.EQUIPMENT_SLOT_SHIELD]).toBeNull();
        const c2 = m.createEntity('c-goblin');
        c.dice.cheat(0.5);
        const ao = m.deliverAttack(c, c2);
        expect(aLog1).toEqual(['do NOT reroll attack 11']);
    });

    it('should attack twice when attack roll is <= 2', function () {
        const m = new Manager();
        m.loadModule('classic');
        const aLog1 = [];
        const pNewScript = function ({ property, manager, creature, target, attack }) {
            const nPrevRoll = attack.roll;
            const cg = creature.getters;
            let b = false;
            if (!!attack.weapon && cg.isWieldingTwoHandedWeapon && attack.attackType === CONSTS.ATTACK_TYPE_MELEE) {
                if (!attack.hit && attack.roll <= 2) {
                    b = true;
                    creature.dice.cheat(0.5);
                    attack.attack();
                }
            }
            aLog1.push(b ? `reroll attack ${nPrevRoll} -> ${attack.roll}` : `do NOT reroll attack ${attack.roll}`);
        };
        m.defineModule({
            scripts: {
                'at-ffs-great-weapon-second-chance': pNewScript
            }
        });
        const c = m.createEntity('c-orc');
        m.addCreatureFeat(c, 'FEAT_FIGHTING_STYLE_GREAT_WEAPON');
        const w = m.createEntity('wpn-great-axe');
        c.equipItem(w);
        expect(c.getters.getEquipment[CONSTS.EQUIPMENT_SLOT_SHIELD]).toBeNull();
        const c2 = m.createEntity('c-goblin');
        c.dice.cheat(0.001);
        const ao = m.deliverAttack(c, c2);
        expect(aLog1).toEqual(['reroll attack 1 -> 11', 'do NOT reroll attack 11']);
    });

    it('should not infinite loop when both attack die are low', function () {
        const m = new Manager();
        m.loadModule('classic');
        const aLog1 = [];
        const X = Symbol('X');
        const pNewScript = function ({ property, manager, creature, target, attack }) {
            const nPrevRoll = attack.roll;
            const cg = creature.getters;
            let b = false;
            if (attack[X]) {
                return;
            }
            if (!!attack.weapon && cg.isWieldingTwoHandedWeapon && attack.attackType === CONSTS.ATTACK_TYPE_MELEE) {
                if (!attack.hit && attack.roll <= 2) {
                    b = true;
                    attack[X] = true;
                    attack.attack();
                }
            }
            aLog1.push(b ? `reroll attack ${nPrevRoll} -> ${attack.roll}` : `do NOT reroll attack ${attack.roll}`);
        };
        m.defineModule({
            scripts: {
                'at-ffs-great-weapon-second-chance': pNewScript
            }
        });
        const c = m.createEntity('c-orc');
        m.addCreatureFeat(c, 'FEAT_FIGHTING_STYLE_GREAT_WEAPON');
        const w = m.createEntity('wpn-great-axe');
        c.equipItem(w);
        expect(c.getters.getEquipment[CONSTS.EQUIPMENT_SLOT_SHIELD]).toBeNull();
        const c2 = m.createEntity('c-goblin');
        c.dice.cheat(0.001);
        const ao = m.deliverAttack(c, c2);
        expect(aLog1).toEqual(['reroll attack 1 -> 1']);
    });
});

describe('fighter feat fighting style duelling', function () {
    it('should not add two points of damage when not having duelling feat', function () {
        const m = new Manager();
        m.loadModule('classic');
        const c = m.createEntity('c-orc');
        const w = m.createEntity('wpn-short-sword');
        c.equipItem(w);
        expect(c.getters.getEquipment[CONSTS.EQUIPMENT_SLOT_SHIELD]).toBeNull();
        const c2 = m.createEntity('c-goblin');
        c.dice.cheat(0.99);
        const ao = m.deliverAttack(c, c2);
        expect(ao.damages.amount).toBe(12);
    });

    it('should add two points of damage when having short sword', function () {
        const m = new Manager();
        m.loadModule('classic');
        const c = m.createEntity('c-orc');
        m.addCreatureFeat(c, 'FEAT_FIGHTING_STYLE_DUELLING');
        const w = m.createEntity('wpn-short-sword');
        c.equipItem(w);
        expect(c.getters.getEquipment[CONSTS.EQUIPMENT_SLOT_SHIELD]).toBeNull();
        const c2 = m.createEntity('c-goblin');
        c.dice.cheat(0.99);
        const ao = m.deliverAttack(c, c2);
        // console.log(ao.damages);
        // console.log(c.getters.getInnateProperties);
        expect(ao.damages.amount).toBe(14);
    });
});
