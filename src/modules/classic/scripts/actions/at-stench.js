const {CONSTS} = require('../../../../../index');

/**
 * Stench
 * Applies disadvantage on attack for anybody within action range.
 * @this {Manager}
 * @param manager {Manager}
 * @param action {RBSAction}
 * @param combat {Combat}
 */
function main ({ manager, action, combat }) {
    const { range, duration = combat.attacker.getters.getVariables['DEFAULT_AILMENT_DURATION'] } = action; // getActionDuration
    const aOffenders = manager.combatManager.getOffenders(combat.attacker, range);
    aOffenders.forEach(offender => {
        const { success } = offender.rollSavingThrow(
            manager.CONSTS.ABILITY_CONSTITUTION,
            combat.attacker.getters.getSpellDifficultyClass[manager.CONSTS.ABILITY_CHARISMA],
            manager.CONSTS.THREAT_TYPE_POISON
        );
        if (!success) {
            const ePoison = manager.createEffect(manager.CONSTS.EFFECT_DAMAGE, 1, { damageType: CONSTS.DAMAGE_TYPE_POISON});
            manager.applyEffect(ePoison, offender, duration, combat.attacker);
        }
    });
}

module.exports = main;
