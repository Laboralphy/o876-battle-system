/**
 * Petrifying gaze
 * Same as petrifying ray but the offensive saving throw DC is lead by CHARISMA instead of DEXTERITY and the effect is supernatural
 * This is the attaque of Medusa, basilisk...
 * Target failing at saving throw will be turned to stone (and dead)
 * This effect is cancelled if the source creature dies.
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
        creature.getters.getSpellDifficultyClass[manager.CONSTS.ABILITY_CHARISMA],
        manager.CONSTS.THREAT_TYPE_PETRIFICATION
    );
    if (!success) {
        const eStone = manager.createSupernaturalEffect(manager.CONSTS.EFFECT_PETRIFICATION);
        manager.applyEffect(eStone, target, Infinity, creature);
    }
}

module.exports = main;
