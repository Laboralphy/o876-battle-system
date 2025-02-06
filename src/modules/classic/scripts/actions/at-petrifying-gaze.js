/**
 * Petrifying gaze
 * Same as petrifying ray but the offensive saving throw DC is lead by DEXTERITY instead of Charisma
 * Target failing at saving throw will be turned to stone (and dead)
 * This effect is cancelled if the source creature dies.
 * @this {Manager}
 * @param manager {Manager}
 * @param action {RBSAction}
 * @param combat {Combat}
 */
function main ({ manager, action, combat }) {
    const oTarget = combat.target
    const { success } = oTarget.rollSavingThrow(
        manager.CONSTS.ABILITY_CONSTITUTION,
        combat.attacker.getters.getSpellDifficultyClass[manager.CONSTS.ABILITY_DEXTERITY]
    )
    if (!success) {
        const eStone = manager.createEffect(manager.CONSTS.EFFECT_PETRIFICATION)
        manager.applyEffect(eStone, oTarget, Infinity, combat.attacker)
    }
}

module.exports = main
