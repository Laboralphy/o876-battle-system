/**
 * Frightful glare
 * Target failing at saving throw will be struck by fear
 *
 * combat dependdencies :
 * - attacker
 * - target
 *
 * @this {Manager}
 * @param manager {Manager}
 * @param action {RBSAction}
 * @param creature {Creature}
 * @param target {Creature}
 */
function main ({ manager, action, creature, target }) {
    const { duration = creature.getters.getVariables['DEFAULT_AILMENT_DURATION'] } = action; // getActionDuration
    const { success } = target.rollSavingThrow( // rollSavingThrow(creature, ability, dc)
        manager.CONSTS.ABILITY_WISDOM,
        creature.getters.getSpellDifficultyClass[manager.CONSTS.ABILITY_CHARISMA],
        manager.CONSTS.THREAT_TYPE_FEAR
    );
    if (!success) {
        const eFear = manager.createExtraordinaryEffect(manager.CONSTS.EFFECT_FEAR); // createEffect(effectType, amp, parameters)
        manager.applyEffect(eFear, target, duration, creature); // applyEffect(effect, creature, duration, creature)
    }
}

module.exports = main;
