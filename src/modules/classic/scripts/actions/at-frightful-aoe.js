/**
 * Frightful presence
 * Offenders failing at saving throw will be struck by fear
 * @this {Manager}
 * @param manager {Manager}
 * @param CONSTS {*}
 * @param action {RBSAction}
 * @param combat {Combat}
 */
function main ({ manager, action, combat }) {
    const { range, duration = combat.attacker.data.VARIABLES.DEFAULT_AILMENT_DURATION } = action
    const aOffenders = manager.combatManager.getOffenders(combat.attacker, range)
    aOffenders.forEach(offender => {
        const { success } = offender.rollSavingThrow(
            manager.CONSTS.ABILITY_WISDOM,
            combat.attacker.getters.getSpellDifficultyClass[manager.CONSTS.ABILITY_CHARISMA]
        )
        if (!success) {
            const eFear = manager.createEffect(manager.CONSTS.EFFECT_FEAR)
            manager.applyEffect(eFear, offender, duration, combat.attacker)
        }
    })
}

module.exports = main
