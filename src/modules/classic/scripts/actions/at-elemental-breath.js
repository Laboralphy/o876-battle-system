const { doDamage } = require('../../../../libs/helpers')
const { checkConst } = require("../../../../libs/check-const");

/**
 * Elemental breath
 * A huge cone of elemental damage is breath att all offenders
 * This is an extraordinary attack
 * If target succeed in saving throw, damage is halved
 * @this {Manager}
 * @param manager {Manager}
 * @param action {RBSAction}
 * @param combat {Combat}
 */
function main ({ manager, action, combat }) {
    const { range } = action
    const aOffenders = manager.combatManager.getOffenders(combat.attacker, range)
    aOffenders.forEach(offender => {
        doDamage(manager, offender, combat.attacker, {
            amount: action.parameters.amount,
            damageType: checkConst(action.parameters.damageType),
            offensiveAbility: manager.CONSTS.ABILITY_DEXTERITY,
            defensiveAbility: manager.CONSTS.ABILITY_DEXTERITY,
            extraordinary: true
        })
    })
}

module.exports = main
