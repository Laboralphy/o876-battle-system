/**
 * Vampiric bite
 * Will do damage to a non acting creature, the damage dealt will heal the source
 *
 * @this {Manager}
 * @param manager {Manager}
 * @param action {RBSAction}
 * @param creature {Creature}
 * @param target {Creature}
 */
function main ({ manager, action, creature, target }) {
    // affect only humanoids
    if (!target.getters.getCapabilitySet.has(manager.CONSTS.CAPABILITY_ACT)) {
        const oAttacker = creature;
        // compute piercing damage amount
        const nPiercingDamage = oAttacker.dice.roll('1d6') + oAttacker.getters.getAbilityModifiers[manager.CONSTS.ABILITY_STRENGTH];
        // compute withering damage amount
        const nWitheringDamage = oAttacker.dice.roll('3d6');
        // create damage effect (piercing supernatural)
        const ePiercingDamage = manager.createExtraordinaryEffect(
            manager.CONSTS.EFFECT_DAMAGE,
            nPiercingDamage,
            {
                damageType: manager.CONSTS.DAMAGE_TYPE_PIERCING
            }
        );
        // create damage effect (withering supernatural)
        const eWitheringDamage = manager.createSupernaturalEffect(
            manager.CONSTS.EFFECT_DAMAGE,
            nWitheringDamage,
            {
                damageType: manager.CONSTS.DAMAGE_TYPE_WITHERING
            }
        );
        // applying damage effects
        manager.applyEffect(ePiercingDamage, target, 0, oAttacker);
        const w = manager.applyEffect(eWitheringDamage, target, 0, oAttacker);
        // if some damage has been done
        if (w.data.appliedAmount > 0) {
            // healing effect
            const eHeal = manager.createEffect(manager.CONSTS.EFFECT_HEAL, w.data.appliedAmount);
            manager.applyEffect(eHeal, oAttacker);
            const { success } = target.rollSavingThrow(
                manager.CONSTS.ABILITY_CONSTITUTION,
                oAttacker.getters.getSpellDifficultyClass[manager.CONSTS.ABILITY_CHARISMA],
                manager.CONSTS.THREAT_TYPE_DEATH
            );
            if (!success) { // saving throw failed
                // absorb experience level if saving throw fails
                const eNegLevel = manager.createSupernaturalEffect(manager.CONSTS.EFFECT_NEGATIVE_LEVEL, 1);
                manager.applyEffect(eNegLevel, target, Infinity, oAttacker);
            }
        }
    }
}

module.exports = main;
