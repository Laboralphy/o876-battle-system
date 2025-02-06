/**
 * Frightful glare
 * Target failing at saving throw will be struck by fear
 * @this {Manager}
 * @param manager {Manager}
 * @param action {RBSAction}
 * @param combat {Combat}
 */
function main ({ manager, action, combat }) {
    const { duration = combat.attacker.data.VARIABLES.DEFAULT_AILMENT_DURATION } = action // getActionDuration
    const oTarget = combat.target // getCombatTarget
    const { success } = oTarget.rollSavingThrow( // rollSavingThrow(creature, ability, dc)
        manager.CONSTS.ABILITY_WISDOM,
        combat.attacker.getters.getSpellDifficultyClass[manager.CONSTS.ABILITY_CHARISMA] // getActionDifficultyClass(creature, ability)
    )
    if (!success) {
        const eFear = manager.createEffect(manager.CONSTS.EFFECT_FEAR) // createEffect(effectType, amp, parameters)
        manager.applyEffect(eFear, oTarget, duration, combat.attacker) // applyEffect(effect, creature, duration, creature)
    }
}

module.exports = main
