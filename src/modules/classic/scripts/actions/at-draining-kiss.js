const { doDamage } = require('../../../../libs/helpers')

/**
 * Draining Kiss
 * Will do damage to a stunned creature, the damage dealt will heal the source,
 * This is a supernatural effect.
 * @this {Manager}
 * @param manager {Manager}
 * @param action {RBSAction}
 * @param combat {Combat}
 */
function main ({ manager, action, combat }) {
    const oTarget = combat.target
    if (oTarget.getters.getEffectSet.has(manager.CONSTS.EFFECT_STUN)) {
        const oAttacker = combat.attacker
        const { effect } = doDamage(manager, oTarget, oAttacker, {
            amount: oAttacker.dice.roll(action.parameters.amount) + oAttacker.getters.getAbilityModifiers[manager.CONSTS.ABILITY_CHARISMA],
            damageType: manager.CONSTS.DAMAGE_TYPE_PSYCHIC,
            offensiveAbility: manager.CONSTS.ABILITY_CHARISMA,
            defensiveAbility: manager.CONSTS.ABILITY_CONSTITUTION,
            extraordinary: true
        })
        if (effect.data.appliedAmount > 0) {
            const eHeal = manager.createSupernaturalEffect(manager.CONSTS.EFFECT_HEAL, effect.data.appliedAmount)
            manager.applyEffect(eHeal, oAttacker)
        }
    }
}

module.exports = main
