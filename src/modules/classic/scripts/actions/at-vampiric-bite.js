/**
 * Vampiric bite
 * Will do damage to a non acting creature, the damage dealt will heal the source
 * @this {Manager}
 * @param manager {Manager}
 * @param action {RBSAction}
 * @param combat {Combat}
 */
function main ({ manager, action, combat }) {
    const oTarget = combat.target
    // affect only humanoids
    if (!oTarget.getters.getCapabilitySet.has(manager.CONSTS.CAPABILITY_ACT)) {
        const oAttacker = combat.attacker
        // compute piercing damage amount
        const nPiercingDamage = oAttacker.dice.roll('1d6') + oAttacker.getters.getAbilityModifiers[manager.CONSTS.ABILITY_STRENGTH]
        // compute withering damage amount
        const nWitheringDamage = oAttacker.dice.roll('3d6')
        // create damage effect (piercing supernatural)
        const ePiercingDamage = manager.createExtraordinaryEffect(
            manager.CONSTS.EFFECT_DAMAGE,
            nPiercingDamage,
            {
                damageType: manager.CONSTS.DAMAGE_TYPE_PIERCING
            }
        )
        // create damage effect (withering supernatural)
        const eWitheringDamage = manager.createSupernaturalEffect(
            manager.CONSTS.EFFECT_DAMAGE,
            nWitheringDamage,
            {
                damageType: manager.CONSTS.DAMAGE_TYPE_WITHERING
            }
        )
        // applying damage effects
        manager.applyEffect(ePiercingDamage, oTarget, 0, oAttacker)
        const w = manager.applyEffect(eWitheringDamage, oTarget, 0, oAttacker)
        // if some damage has been done
        if (w.data.appliedAmount > 0) {
            // healing effect
            const eHeal = manager.createEffect(manager.CONSTS.EFFECT_HEAL, w.data.appliedAmount)
            manager.applyEffect(eHeal, oAttacker)
            const { success } = oTarget.rollSavingThrow(
                manager.CONSTS.ABILITY_CONSTITUTION,
                oAttacker.getters.getSpellDifficultyClass[manager.CONSTS.ABILITY_CHARISMA]
            )
            if (!success) { // saving throw failed
                // absorb experience level if saving throw fails
                const eNegLevel = manager.createSupernaturalEffect(manager.CONSTS.EFFECT_NEGATIVE_LEVEL, 1)
                manager.applyEffect(eNegLevel, oTarget, Infinity, oAttacker)
            }
        }
    }
}

module.exports = main
