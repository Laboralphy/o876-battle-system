/**
 * Stunning glare
 * Target failing at saving throw will be stunned
 *
 * @this {Manager}
 * @param manager {Manager}
 * @param action {RBSAction}
 * @param creature {Creature}
 * @param target {Creature}
 */
function main ({ manager, action, creature, target }) {
    const { duration = creature.getters.getVariables['DEFAULT_AILMENT_DURATION'] } = action;
    const { success } = target.rollSavingThrow(
        manager.CONSTS.ABILITY_WISDOM,
        creature.getters.getSpellDifficultyClass[manager.CONSTS.ABILITY_CHARISMA]
    );
    if (!success) {
        const eFear = manager.createEffect(manager.CONSTS.EFFECT_STUN);
        manager.applyEffect(eFear, target, duration, creature);
    }
}

module.exports = main;
