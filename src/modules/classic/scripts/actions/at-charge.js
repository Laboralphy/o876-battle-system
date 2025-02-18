/**
 * Charge
 * If target within range : reduce combat distance at mélée weapon range and do damage
 * This is an ordinary attack
 * @this {Manager}
 * @param manager {Manager}
 * @param action {RBSAction}
 * @param combat {Combat}
 */
function main ({ manager, action, combat }) {
    const { range } = action;
    const attacker = combat.attacker;
    const target = combat.target;
    const { parameters: { amount } } = action;
    if (combat.distance <= range) {
        combat.approachTarget(range);
        manager.deliverAttack(attacker, target, { additionalWeaponDamage: amount });
    }
}


module.exports = main;
