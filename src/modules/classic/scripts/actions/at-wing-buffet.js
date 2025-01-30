const { doDamage } = require('../../../../libs/helpers')

/**
 * Wing buffet
 * A wing attack that deals damage to all offender.
 * If target fails saving throw it will be stunned until the end of the turn
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
        const { savingThrow: success } = doDamage(manager, offender, combat.attacker, {
            amount: action.parameters.amount,
            damageType: manager.CONSTS.DAMAGE_TYPE_CRUSHING,
            offensiveAbility: manager.CONSTS.ABILITY_STRENGTH,
            defensiveAbility: manager.CONSTS.ABILITY_STRENGTH
        })
        if (!success) {
            const eStun = manager.createEffect(manager.CONSTS.EFFECT_STUN)
            manager.applyEffect(eStun, offender, 1, combat.attacker)
        }
    })
}


module.exports = main
