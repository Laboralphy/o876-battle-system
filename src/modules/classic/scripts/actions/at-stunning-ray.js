/**
 * Stunning ray
 * Target failing at saving throw will be struck by fear
 * @this {Manager}
 * @param manager {Manager}
 * @param action {RBSAction}
 * @param combat {Combat}
 */
function main ({ manager, action, combat }) {
    const { duration = combat.attacker.data.VARIABLES.DEFAULT_AILMENT_DURATION } = action
    const oTarget = combat.target
    const { success } = oTarget.rollSavingThrow(
        manager.CONSTS.ABILITY_WISDOM,
        combat.attacker.getters.getSpellDifficultyClass[manager.CONSTS.ABILITY_CHARISMA]
    )
    if (!success) {
        const eFear = manager.createEffect(manager.CONSTS.EFFECT_STUN)
        manager.applyEffect(eFear, oTarget, duration, combat.attacker)
    }
}

module.exports = main
