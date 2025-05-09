const { doDamage, getThreatTypeFromDamageType} = require('../../../../libs/helpers');
const { checkConst } = require('../../../../libs/check-const');

/**
 * Poison breath
 * A cloud of poison damage is breath at all offenders
 * If target succeed in saving throw, poison is avoided
 *
 * combat dependencies :
 * - attacker
 *
 * @this {Manager}
 * @param manager {Manager}
 * @param action {RBSAction}
 * @param combat {Combat}
 */
function main ({ manager, action, combat }) {
    const {
        range,
        duration = combat.attacker.getters.getVariables['DEFAULT_POISON_DURATION'],
        parameters: {
            amount
        }
    } = action;
    const aOffenders = manager.combatManager.getOffenders(combat.attacker, range);
    aOffenders.forEach(offender => {
        const { success } = offender.rollSavingThrow(
            manager.CONSTS.ABILITY_CONSTITUTION,
            combat.attacker.getters.getSpellDifficultyClass[manager.CONSTS.ABILITY_DEXTERITY],
            manager.CONSTS.THREAT_TYPE_POISON
        );
        if (!success) {
            const ePoison = manager.createExtraordinaryEffect(manager.CONSTS.EFFECT_DAMAGE, amount, {
                damageType: manager.CONSTS.DAMAGE_TYPE_POISON
            });
            manager.applyEffect(ePoison, offender, duration, combat.attacker);
        }
    });
}

module.exports = main;
