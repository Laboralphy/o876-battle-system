const CONSTS = require('../consts')
const { aggregateModifiers } = require('../libs/aggregator')

const oAdvantages = {
    [CONSTS.ADV_ATTACK_PROPERTY_EFFECT]: attackOutcome => {
        const oAttacker = attackOutcome.attacker
        const sAttackType = attackOutcome.attackType

        const f = propOrEffect => propOrEffect.data.attackType === sAttackType || propOrEffect.data.attackType === CONSTS.ATTACK_TYPE_ANY

        return aggregateModifiers([
            CONSTS.PROPERTY_ADVANTAGE_ATTACK,
            CONSTS.EFFECT_ADVANTAGE_ATTACK
        ], oAttacker.getters, {
            propFilter: f,
            effectFilter: f
        }).count > 0
    },

    [CONSTS.ADV_ATTACK_TARGET_DISABLED]: attackOutcome =>
        !attackOutcome.target.getters.getCapabilitySet.has(CONSTS.CAPABILITY_FIGHT),

    [CONSTS.ADV_ATTACK_UNDETECTED_BY_TARGET]: attackOutcome =>
        attackOutcome.target.getCreatureVisibility(attackOutcome.attacker) !== CONSTS.CREATURE_VISIBILITY_VISIBLE
}

const oDisadvantages = {
    [CONSTS.DIS_ATTACK_PROPERTY_EFFECT]: attackOutcome => {
        const oAttacker = attackOutcome.attacker
        const sAttackType = attackOutcome.attackType

        const f = propOrEffect => propOrEffect.data.attackType === sAttackType || propOrEffect.data.attackType === CONSTS.ATTACK_TYPE_ANY

        return aggregateModifiers([
            CONSTS.PROPERTY_DISADVANTAGE_ATTACK,
            CONSTS.EFFECT_DISADVANTAGE_ATTACK
        ], oAttacker.getters, {
            propFilter: f,
            effectFilter: f
        }).count > 0
    },

    [CONSTS.DIS_ATTACK_TARGET_UNDETECTED]: attackOutcome =>
        attackOutcome.attacker.getCreatureVisibility(attackOutcome.target) !== CONSTS.CREATURE_VISIBILITY_VISIBLE,

    [CONSTS.DIS_ATTACK_POISONED]: attackOutcome =>
        attackOutcome.attacker.getters.getConditionSet.has(CONSTS.CONDITION_POISONED),

    [CONSTS.DIS_ATTACK_ROOTED]: attackOutcome =>
        attackOutcome.attacker.getters.getConditionSet.has(CONSTS.CONDITION_RESTRAINED),

    [CONSTS.DIS_ATTACK_CONFUSED]: attackOutcome =>
        attackOutcome.attacker.getters.getConditionSet.has(CONSTS.CONDITION_CONFUSED),

    [CONSTS.DIS_ATTACK_BAD_EQUIPMENT]: attackOutcome => {
        const eqp = attackOutcome.attacker.getters.isEquipmentProficient
        return !(eqp[CONSTS.EQUIPMENT_SLOT_CHEST] && eqp[CONSTS.EQUIPMENT_SLOT_SHIELD])
    },

    [CONSTS.DIS_ATTACK_WINDY_ENVIRONMENT]: attackOutcome =>
        attackOutcome.attacker.getters.getEnvironment[CONSTS.DIS_ATTACK_WINDY_ENVIRONMENT] &&
        (
            attackOutcome.attackType === CONSTS.ATTACK_TYPE_RANGED ||
            attackOutcome.attackType === CONSTS.ATTACK_TYPE_RANGED_TOUCH
        )
}

/**
 * Evaluates an object : produces an objet { result: boolean, values: Set<string> }
 * For each entries, evaluates
 * @param object
 * @param params
 * @returns {{result: boolean, values: Set<any>}}
 */
function evaluateObject (object, ...params) {
    return Object
        .entries(object)
        .reduce((prev, [sEntry, f]) => {
            if (f(...params)) {
                prev.result = true
                prev.values.add(sEntry)
            }
            return prev
        }, { result: false, values: new Set()})
}

/**
 *
 * @param params
 * @returns {{result: number, advantages: Set<string>, disadvantages: Set<string>}}
 */
function getAttackAdvantages (...params) {
    const a = evaluateObject(oAdvantages, ...params)
    const d = evaluateObject(oDisadvantages, ...params)
    const  result = (a.result ? 1 : 0) + (d.result ? -1 : 0)
    return {
        advantages: a.values,
        disadvantages: d.values,
        result
    }
}

module.exports = {
    getAttackAdvantages
}
