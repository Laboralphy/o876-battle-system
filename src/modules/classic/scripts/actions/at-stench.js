/**
 * Stench
 * Applies disadvantage on attack for anybody within action range.
 * @this {Manager}
 * @param manager {Manager}
 * @param action {RBSAction}
 * @param combat {Combat}
 */
function main ({ manager, action, combat }) {
    const { range, duration = combat.attacker.data.VARIABLES.DEFAULT_AILMENT_DURATION } = action // getActionDuration
    const aOffenders = manager.combatManager.getOffenders(combat.attacker, range)
    aOffenders.forEach(offender => {
        const { success } = offender.rollSavingThrow(
            manager.CONSTS.ABILITY_CONSTITUTION,
            combat.attacker.getters.getSpellDifficultyClass[manager.CONSTS.ABILITY_CHARISMA]
        )
        if (!success) {
            const eDisadvantage = manager.createEffect(manager.CONSTS.EFFECT_DISADVANTAGE_ATTACK)
            manager.applyEffect(eDisadvantage, offender, duration, combat.attacker)
        }
    })
}

module.exports = main
