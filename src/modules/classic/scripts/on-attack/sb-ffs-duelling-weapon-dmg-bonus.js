const CONSTS = require('../../../../consts');

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
    if (attack.hit && !!attack.weapon && !cg.isWieldingShield && !cg.isWieldingTwoHandedWeapon && attack.attackType === CONSTS.ATTACK_TYPE_MELEE) {
        attack.rollDamages(2, attack.weapon.blueprint.damageType);
    }
}

module.exports = main;
