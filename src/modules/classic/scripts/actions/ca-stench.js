const {getAreaOfEffectTargets} = require('../../../../libs/helpers');

/**
 * Stench
 * Applies disadvantage on attack for anybody within action range.
 *
 * @this {Manager}
 * @param manager {Manager}
 * @param action {RBSAction}
 * @param creature {Creature}
 * @param target {Creature}
 */
function main ({ manager, action, creature, target }) {
    const { range, duration = creature.getters.getVariables['DEFAULT_AILMENT_DURATION'] } = action; // getActionDuration
    getAreaOfEffectTargets(manager, creature, target, range).forEach(offender => {
        const { success } = offender.rollSavingThrow(
            manager.CONSTS.ABILITY_CONSTITUTION,
            creature.getters.getSpellDifficultyClass[manager.CONSTS.ABILITY_CHARISMA],
            manager.CONSTS.THREAT_TYPE_POISON
        );
        if (!success) {
            const ePoison = manager.createEffect(manager.CONSTS.EFFECT_DAMAGE, 1, { damageType: manager.CONSTS.DAMAGE_TYPE_POISON});
            manager.applyEffect(ePoison, offender, duration, creature);
        }
    });
}

module.exports = main;
