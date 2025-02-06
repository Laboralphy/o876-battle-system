/**
 *
 * @param action
 * @param combat
 * @param manager {Manager}
 */
function main ({ action, combat, manager }) {
    // La succube va tester si sa cible est stun
    const oTarget = combat.target
    if (oTarget.getters.getEffectSet.has(manager.CONSTS.EFFECT_STUN)) {
        action('act-draining-kiss')
    } else if (!oTarget.getters.getImmunitySet.has(manager.CONSTS.IMMUNITY_TYPE_STUN)) {
        // la cible n'est pas stun : choisir l'action de stun
        // Sauf si la cible est immunisée
        action('act-charm')
    }
}

module.exports = main
