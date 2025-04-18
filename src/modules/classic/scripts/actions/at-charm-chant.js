/**
 * Charm Chant
 * Offenders hearing this chant and failing at saving throw will be struck by charm
 * This is an extraordinary effect
 * @this {Manager}
 * @param manager {Manager}
 * @param action {RBSAction}
 * @param combat {Combat}
 */
function main ({ manager, action, combat }) {
    const { range, duration = combat.attacker.getters.getVariables['DEFAULT_AILMENT_DURATION'] } = action;
    const aOffenders = manager.combatManager.getOffenders(combat.attacker, range);
    aOffenders.forEach(offender => {
        const { success } = offender.rollSavingThrow(
            manager.CONSTS.ABILITY_WISDOM,
            combat.attacker.getters.getSpellDifficultyClass[manager.CONSTS.ABILITY_CHARISMA]
        );
        if (!success) {
            const eFear = manager.createExtraordinaryEffect(manager.CONSTS.EFFECT_CHARM);
            manager.applyEffect(eFear, offender, duration, combat.attacker);
        }
    });
}

module.exports = main;
