const CONSTS = require('../../../../consts');

const FFS_GREAT_WEAPON_SECOND_CHANCE = Symbol('FFS_GREAT_WEAPON_SECOND_CHANCE');

/**
 * script for FEAT_FIGHTING_STYLE_DUELLING
 * adds 2 damage points if creature is wielding a one-handed weapon, and no shield, and attacking with melee weapon
 *
 * @param property {RBSProperty}
 * @param manager {Manager}
 * @param creature {Creature}
 * @param target {Creature}
 * @param attack {AttackOutcome}
 */
function main ({ property, manager, creature, target, attack }) {
    const cg = creature.getters;
    if (!attack[FFS_GREAT_WEAPON_SECOND_CHANCE] && !!attack.weapon && cg.isWieldingTwoHandedWeapon && attack.attackType === CONSTS.ATTACK_TYPE_MELEE) {
        if (!attack.hit && attack.roll <= 2) {
            attack[FFS_GREAT_WEAPON_SECOND_CHANCE] = true;
            attack.attack();
        }
    }
}

module.exports = main;
