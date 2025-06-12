const { doDamage } = require('../../../../libs/helpers');
const { checkConst } = require('../../../../libs/check-const');

/**
 * Fire grenade
 *
 * combat dependencies :
 * - attacker
 *
 * @this {Manager}
 * @param manager {Manager}
 * @param action {RBSAction}
 * @param creature {Creature}
 * @param target {Creature}
 * @param radius {number}
 */
function main ({ manager, action, creature, target, radius = 10 }) {
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
