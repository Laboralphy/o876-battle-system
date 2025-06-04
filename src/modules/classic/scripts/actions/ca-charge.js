/**
 * Charge
 * If target within range : reduce combat distance at mélée weapon range and do damage
 * This is an ordinary attack
 *
 * combat dependencies :
 * - attacker
 * - target
 * - distance
 * - approachTarget
 *
 * @this {Manager}
 * @param manager {Manager}
 * @param action {RBSAction}
 * @param creature {Creature}
 * @param target {Creature}
 */
function main ({ manager, action, creature, target }) {
    const combat = manager.combatManager.getCombat(creature);
    const { range } = action;
    const { parameters: { amount } } = action;
    if (combat.distance <= range) {
        combat.approachTarget(range);
        manager.deliverAttack(creature, target, { additionalWeaponDamage: amount });
    }
}


module.exports = main;
