const { doDamage } = require('../../../../libs/helpers');
const { checkConst } = require('../../../../libs/check-const');

/**
 * Elemental breath
 * A huge cone of elemental damage is breath att all offenders
 * This is an extraordinary attack
 * If target succeed in saving throw, damage is halved
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
    const aOffenders = manager.combatManager.getOffenders(creature, range);
    aOffenders.forEach(offender => {
        doDamage(manager, offender, creature, {
            amount: action.parameters.amount,
            damageType: checkConst(action.parameters.damageType),
            offensiveAbility: manager.CONSTS.ABILITY_DEXTERITY,
            defensiveAbility: manager.CONSTS.ABILITY_DEXTERITY,
            extraordinary: true
        });
    });
}

module.exports = main;
