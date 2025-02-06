/**
 * Petrifying ray
 * Target failing at saving throw will be turned to stone (and dead)
 * This effect is cancelled if the source creature dies.
 * You should team with other people before attacking such creatures (Medusas, gorgons, basilisks)
 * @this {Manager}
 * @param manager {Manager}
 * @param action {RBSAction}
 * @param combat {Combat}
 */
function main ({ manager, action, combat }) {
    const oTarget = combat.target
    const { success } = oTarget.rollSavingThrow(
        manager.CONSTS.ABILITY_CONSTITUTION,
        combat.attacker.getters.getSpellDifficultyClass[manager.CONSTS.ABILITY_CHARISMA]
    )
    if (!success) {
        const eStone = manager.createEffect(manager.CONSTS.EFFECT_PETRIFICATION)
        manager.applyEffect(eStone, oTarget, Infinity, combat.attacker)
    }
}

module.exports = main
