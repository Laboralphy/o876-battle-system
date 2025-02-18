/**
 * Petrifying gaze
 * an AOE version of petrification as extraordinary effect
 * a vapor of toxic chemical surrounds all offenders, turning them to stone.
 * Target failing at saving throw will be turned to stone
 * Target will remain petrified until the beast is killed, and the vapor dissipates
 * @this {Manager}
 * @param manager {Manager}
 * @param action {RBSAction}
 * @param combat {Combat}
 */
function main ({ manager, action, combat }) {
    const { range } = action;
    const aOffenders = manager.combatManager.getOffenders(combat.attacker, range);
    aOffenders.forEach(oTarget => {
        const {success} = oTarget.rollSavingThrow(
            manager.CONSTS.ABILITY_CONSTITUTION,
            combat.attacker.getters.getSpellDifficultyClass[manager.CONSTS.ABILITY_DEXTERITY]
        );
        if (!success) {
            const eStone = manager.createExtraordinaryEffect(manager.CONSTS.EFFECT_PETRIFICATION);
            manager.applyEffect(eStone, oTarget, Infinity, combat.attacker);
        }
    });
}

module.exports = main;
