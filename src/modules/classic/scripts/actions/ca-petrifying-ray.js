/**
 * Petrifying ray
 * Target failing at saving throw will be turned to stone (and dead)
 * This effect is cancelled if the source creature dies.
 * You should team with other people before attacking such creatures (Medusas, gorgons, basilisks)
 *
 * combat dependencies
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
    const { success } = target.rollSavingThrow(
        manager.CONSTS.ABILITY_CONSTITUTION,
        creature.getters.getSpellDifficultyClass[manager.CONSTS.ABILITY_DEXTERITY],
        manager.CONSTS.THREAT_TYPE_PETRIFICATION
    );
    if (!success) {
        const eStone = manager.createExtraordinaryEffect(manager.CONSTS.EFFECT_PETRIFICATION);
        manager.applyEffect(eStone, target, Infinity, creature);
    }
}

module.exports = main;
