const {getAreaOfEffectTargets} = require('../../../../libs/helpers');

/**
 * Petrifying gaze
 * an AOE version of petrification as extraordinary effect
 * a vapor of toxic chemical surrounds all offenders, turning them to stone.
 * Target failing at saving throw will be turned to stone
 * Target will remain petrified until the beast is killed, and the vapor dissipates
 *
 * combat dependencies :
 * - attacker
 *
 * @this {Manager}
 * @param manager {Manager}
 * @param action {RBSAction}
 * @param creature {Creature}
 * @param target {Creature}
 */
function main ({ manager, action, creature, target }) {
    const { range } = action;
    getAreaOfEffectTargets(manager, creature, target, range).forEach(oTarget => {
        const {success} = oTarget.rollSavingThrow(
            manager.CONSTS.ABILITY_CONSTITUTION,
            creature.getters.getSpellDifficultyClass[manager.CONSTS.ABILITY_DEXTERITY],
            manager.CONSTS.THREAT_TYPE_PETRIFICATION
        );
        if (!success) {
            const eStone = manager.createExtraordinaryEffect(manager.CONSTS.EFFECT_PETRIFICATION);
            manager.applyEffect(eStone, oTarget, Infinity, creature);
        }
    });
}

module.exports = main;
