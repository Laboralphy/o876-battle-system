const {getAreaOfEffectTargets} = require('../../../../libs/helpers');

/**
 * Charm Chant
 * Offenders hearing this chant and failing at saving throw will be struck by charm
 * This is an extraordinary effect
 *
 * @this {Manager}
 * @param manager {Manager}
 * @param action {RBSAction}
 * @param creature {Creature}
 * @param target {Creature}
 */
function main ({ manager, action, creature, target }) {
    const { range, duration = creature.getters.getVariables['DEFAULT_AILMENT_DURATION'] } = action;
    getAreaOfEffectTargets(manager, creature, target, Infinity).forEach(offender => {
        const { success } = offender.rollSavingThrow(
            manager.CONSTS.ABILITY_WISDOM,
            creature.getters.getSpellDifficultyClass[manager.CONSTS.ABILITY_CHARISMA],
            manager.CONSTS.THREAT_TYPE_CHARM
        );
        if (!success) {
            const eFear = manager.createExtraordinaryEffect(manager.CONSTS.EFFECT_CHARM);
            manager.applyEffect(eFear, offender, duration, creature);
        }
    });
}

module.exports = main;
