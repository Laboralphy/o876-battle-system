const CONSTS = require('../consts')
const { aggregateModifiers } = require('../libs/aggregator')

/**
 *
 * @param attackOutcome {AttackOutcome}
 * @return {boolean}
 */
function isAttackAdvantaged (attackOutcome) {
    const oAttacker = attackOutcome.attacker
    const oTarget = attackOutcome.target
    const sAttackType = attackOutcome.attackType

    // Attacker is advantaged when
    // - Attacker is not detected by target
    // - Target is unable to fight
    // - Attacker has an effect or a prop that gives advantage

    const bAttackerUndetected = oAttacker.getCreatureVisibility(oTarget) !== CONSTS.CREATURE_VISIBILITY_VISIBLE
    const bTargetDisabled = !oTarget.getters.getCapabilitySet.has(CONSTS.CAPABILITY_FIGHT)

    // Last : Check if property or effect is active
    const f = propOrEffect => propOrEffect.data.attackType === sAttackType || propOrEffect.data.attackType === CONSTS.ATTACK_TYPE_ANY

    const bPropOrEffect = aggregateModifiers([
        CONSTS.PROPERTY_ADVANTAGE_ATTACK,
        CONSTS.EFFECT_ADVANTAGE_ATTACK
    ], oAttacker.getters, {
        propFilter: f,
        effectFilter: f
    }).count > 0

    console.log({
        bAttackerUndetected,
        bTargetDisabled,
        bPropOrEffect
    })
    return bAttackerUndetected || bTargetDisabled || bPropOrEffect
}

/**
 *
 * @param attackOutcome {AttackOutcome}
 * @returns {boolean}
 */
function isAttackDisadvantaged (attackOutcome) {
    // Attacker is disadvantaed when0
    // - Attacker wearing non proficient armor or shield
    // - Attacker is poisoned, confused or rooted
    // - Target is not detectable
    const oAttacker = attackOutcome.attacker
    const oTarget = attackOutcome.target
    const sAttackType = attackOutcome.attackType

    // checking target visibility
    const bTargetUndetected = oAttacker.getCreatureVisibility(oTarget) !== CONSTS.CREATURE_VISIBILITY_VISIBLE

    // checking armor and shield proficiency
    const eqp = oAttacker.getters.isEquipmentProficient
    const bGoodEquip = eqp[CONSTS.EQUIPMENT_SLOT_CHEST] && eqp[CONSTS.EQUIPMENT_SLOT_SHIELD]
    const bBadEquip = !bGoodEquip

    // Checking attacker condition
    const oConditionSet = oAttacker.getters.getConditionSet
    const bPoisoned = oConditionSet.has(CONSTS.CONDITION_POISONED)
    const bRooted = oConditionSet.has(CONSTS.CONDITION_RESTRAINED)
    const bConfused = oConditionSet.has(CONSTS.CONDITION_CONFUSED)

    // Check if property or effect is active
    const f = propOrEffect => propOrEffect.data.attackType === sAttackType || propOrEffect.data.attackType === CONSTS.ATTACK_TYPE_ANY

    const bPropOrEffect = aggregateModifiers([
        CONSTS.PROPERTY_DISADVANTAGE_ATTACK,
        CONSTS.EFFECT_DISADVANTAGE_ATTACK
    ], oAttacker.getters, {
        propFilter: f,
        effectFilter: f
    }).count > 0

    console.log({
        bTargetUndetected,
        bPoisoned,
        bConfused,
        bRooted,
        bBadEquip,
        bPropOrEffect
    })
    // result
    return bTargetUndetected || bPoisoned || bConfused || bRooted || bBadEquip || bPropOrEffect
}

module.exports = {
    isAttackAdvantaged,
    isAttackDisadvantaged
}
