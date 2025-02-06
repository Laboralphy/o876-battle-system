const { doDamage } = require('../../../../libs/helpers')
const { checkConst } = require("../../../../libs/check-const");

/**
 * Elemental breath
 * A huge cone of elemental damage is breath att all offenders
 * If target succeed in saving throw, damage is halved
 * @this {Manager}
 * @param manager {Manager}
 * @param CONSTS {*}
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
            defensiveAbility: manager.CONSTS.ABILITY_DEXTERITY
        })
    })
}

module.exports = main
