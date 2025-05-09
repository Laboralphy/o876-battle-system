/**
 * Frightful presence
 * Offenders failing at saving throw will be struck by fear
 * This is an extraordinary effect, often used by huge creature like dragons
 *
 * combat dependencies :
 * - attacker
 *
 * @this {Manager}
 * @param manager {Manager}
 * @param CONSTS {*}
 * @param action {RBSAction}
 * @param combat {Combat}
 */
function main ({ manager, action, combat }) {
    const { range, duration = combat.attacker.getters.getVariables['DEFAULT_AILMENT_DURATION'] } = action;
    const aOffenders = manager.combatManager.getOffenders(combat.attacker, range);
    aOffenders.forEach(offender => {
        const { success } = offender.rollSavingThrow(
            manager.CONSTS.ABILITY_WISDOM,
            combat.attacker.getters.getSpellDifficultyClass[manager.CONSTS.ABILITY_CHARISMA],
            manager.CONSTS.THREAT_TYPE_FEAR
        );
        if (!success) {
            const eFear = manager.createExtraordinaryEffect(manager.CONSTS.EFFECT_FEAR);
            manager.applyEffect(eFear, offender, duration, combat.attacker);
        }
    });
}

module.exports = main;
