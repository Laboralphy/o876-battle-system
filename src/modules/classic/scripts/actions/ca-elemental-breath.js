const { doDamage, getAreaOfEffectTargets } = require('../../../../libs/helpers');
const { checkConst } = require('../../../../libs/check-const');
const {CONSTS} = require('../../../../../index');

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
function main ({ manager, action, creature, target = null }) {
    const { range } = action;
    getAreaOfEffectTargets(manager, creature, target, range).forEach(offender => {
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
