/**
 *
 * @param oCreature {Creature}
 */
function getDamagePoints (oCreature) {
    const cg = oCreature.getters;
    const hpmax = cg.getMaxHitPoints;
    const hp = oCreature.hitPoints;
    return hpmax - hp;
}

function heal (oManager, oCreature, oHealer, amount) {
    const eHeal = oManager.createEffect(oManager.CONSTS.EFFECT_HEAL, amount);
    oManager.applyEffect(eHeal, oCreature, oHealer);
}

/**
 * Heal
 * Will heal one of target's primary target, if this creature is full hp, will heal another offender
 *
 * combat dependencies :
 * - attacker
 * - target
 *
 * @this {Manager}
 * @param manager {Manager}
 * @param action {RBSAction}
 * @param combat {Combat}
 */
function main ({ manager, action, combat }) {
    const oTarget = combat.target;
    const oTargetCombat = manager.combatManager.getCombat(oTarget);
    const oTargetCombatPrimaryTarget = oTargetCombat.target;
    let oHealedCreature;
    if (getDamagePoints(oTargetCombatPrimaryTarget) > 0) {
        oHealedCreature = oTargetCombatPrimaryTarget;
    } else {
        oHealedCreature = manager
            .combatManager
            .getOffenders(oTarget)
            .map(offender => ({
                offender,
                damagePoints: getDamagePoints(offender)
            }))
            .sort((a, b) => b.damagePoints - a.damagePoints)
            .shift();
    }
    if (oHealedCreature) {
        heal(manager, oHealedCreature, combat.attacker, action.parameters.amount);
    }
}

module.exports = main;
