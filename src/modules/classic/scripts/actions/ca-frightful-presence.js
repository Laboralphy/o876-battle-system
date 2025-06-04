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
 * @param creature {Creature}
 * @param target {Creature}
 */
function main ({ manager, action, creature, target }) {
    const { range, duration = creature.getters.getVariables['DEFAULT_AILMENT_DURATION'] } = action;
    const aOffenders = manager.combatManager.getOffenders(creature, range);
    aOffenders.forEach(offender => {
        const { success } = offender.rollSavingThrow(
            manager.CONSTS.ABILITY_WISDOM,
            creature.getters.getSpellDifficultyClass[manager.CONSTS.ABILITY_CHARISMA],
            manager.CONSTS.THREAT_TYPE_FEAR
        );
        if (!success) {
            const eFear = manager.createExtraordinaryEffect(manager.CONSTS.EFFECT_FEAR);
            manager.applyEffect(eFear, offender, duration, creature);
        }
    });
}

module.exports = main;
