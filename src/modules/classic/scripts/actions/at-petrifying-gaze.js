/**
 * Petrifying gaze
 * Same as petrifying ray but the offensive saving throw DC is lead by CHARISMA instead of DEXTERITY and the effect is supernatural
 * This is the attaque of Medusa, basilisk...
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
        combat.attacker.getters.getSpellDifficultyClass[manager.CONSTS.ABILITY_CHARISMA]
    )
    if (!success) {
        const eStone = manager.createSupernaturalEffect(manager.CONSTS.EFFECT_PETRIFICATION)
        manager.applyEffect(eStone, oTarget, Infinity, combat.attacker)
    }
}

module.exports = main
