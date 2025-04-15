const CONSTS = require('../consts');
const { aggregateModifiers } = require('../libs/aggregator');

/**
 * Usually, advantages are granted on attack when the attacker is unseen by its target, or the target is unable to
 * properly defend itself.
 *
 * @type {{[p: string]: function(AttackOutcome): boolean}}
 */
const oAdvantages = {
    /**
     * An effect or item property may cause advantage.
     * A short duration effect like "true strike" will grant advantage
     * An item having attack advantage property would be considered as unfair
     * @param attackOutcome {AttackOutcome}
     * @returns {boolean}
     */
    [CONSTS.ADV_ATTACK_PROPERTY_EFFECT]: attackOutcome => {
        const oAttacker = attackOutcome.attacker;
        const sAttackType = attackOutcome.attackType;

        const f = propOrEffect => propOrEffect.data.attackType === sAttackType || propOrEffect.data.attackType === CONSTS.ATTACK_TYPE_ANY;

        return aggregateModifiers([
            CONSTS.PROPERTY_ADVANTAGE_ATTACK,
            CONSTS.EFFECT_ADVANTAGE_ATTACK
        ], oAttacker.getters, {
            propFilter: f,
            effectFilter: f
        }).count > 0;
    },

    /**
     * Attacking a disabled target (unable to fight) grants an advantage
     * @param attackOutcome {AttackOutcome}
     * @returns {boolean}
     */
    [CONSTS.ADV_ATTACK_TARGET_DISABLED]: attackOutcome =>
        !attackOutcome.target.getters.getCapabilitySet.has(CONSTS.CAPABILITY_FIGHT),

    /**
     * Attacking an unaware target (because attacker is invisible, stealth, or in dark area) grants an advantage
     * @param attackOutcome {AttackOutcome}
     * @returns {boolean}
     */
    [CONSTS.ADV_ATTACK_UNDETECTED_BY_TARGET]: attackOutcome =>
        attackOutcome.target.getCreatureVisibility(attackOutcome.attacker) !== CONSTS.CREATURE_VISIBILITY_VISIBLE
};

const oDisadvantages = {
    /**
     * Some effects impose a disadvantage
     * @param attackOutcome {AttackOutcome}
     * @returns {boolean}
     */
    [CONSTS.DIS_ATTACK_PROPERTY_EFFECT]: attackOutcome => {
        const oAttacker = attackOutcome.attacker;
        const sAttackType = attackOutcome.attackType;

        const f = propOrEffect => propOrEffect.data.attackType === sAttackType || propOrEffect.data.attackType === CONSTS.ATTACK_TYPE_ANY;

        return aggregateModifiers([
            CONSTS.PROPERTY_DISADVANTAGE_ATTACK,
            CONSTS.EFFECT_DISADVANTAGE_ATTACK
        ], oAttacker.getters, {
            propFilter: f,
            effectFilter: f
        }).count > 0;
    },

    /**
     * Attacking an undetected target (invisible, or in dark area) imposes a disadvantage
     * @param attackOutcome {AttackOutcome}
     * @returns {boolean}
     */
    [CONSTS.DIS_ATTACK_TARGET_UNDETECTED]: attackOutcome =>
        attackOutcome.attacker.getCreatureVisibility(attackOutcome.target) !== CONSTS.CREATURE_VISIBILITY_VISIBLE,

    /**
     * Attacking when poisoned imposes a disadvantage
     * @param attackOutcome {AttackOutcome}
     * @returns {*}
     */
    [CONSTS.DIS_ATTACK_POISONED]: attackOutcome =>
        attackOutcome.attacker.getters.getConditionSet.has(CONSTS.CONDITION_POISONED),

    /**
     * Attacking when rooted imposes a disadvantage
     * @param attackOutcome {AttackOutcome}
     * @returns {*}
     */
    [CONSTS.DIS_ATTACK_ROOTED]: attackOutcome =>
        attackOutcome.attacker.getters.getConditionSet.has(CONSTS.CONDITION_RESTRAINED),

    /**
     * Attacking when confused imposes a disadvantage
     * @param attackOutcome {AttackOutcome}
     * @returns {*}
     */
    [CONSTS.DIS_ATTACK_CONFUSED]: attackOutcome =>
        attackOutcome.attacker.getters.getConditionSet.has(CONSTS.CONDITION_CONFUSED),

    /**
     * Attacking when wearing armor and/or shield when not proficient imposes a disadvantage
     * @param attackOutcome
     * @returns {boolean}
     */
    [CONSTS.DIS_ATTACK_BAD_EQUIPMENT]: attackOutcome => {
        const eqp = attackOutcome.attacker.getters.isEquipmentProficient;
        return !(eqp[CONSTS.EQUIPMENT_SLOT_CHEST] && eqp[CONSTS.EQUIPMENT_SLOT_SHIELD]);
    },

    /**
     * Attacking with ranged weapon in a windy environment imposes a disadvantage
     * @param attackOutcome {boolean}
     * @returns {boolean}
     */
    [CONSTS.DIS_ATTACK_WINDY_ENVIRONMENT]: attackOutcome =>
        !!attackOutcome.attacker.getters.getEnvironment[CONSTS.DIS_ATTACK_WINDY_ENVIRONMENT] &&
        (
            attackOutcome.attackType === CONSTS.ATTACK_TYPE_RANGED ||
            attackOutcome.attackType === CONSTS.ATTACK_TYPE_RANGED_TOUCH
        )
};

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
                prev.result = true;
                prev.values.add(sEntry);
            }
            return prev;
        }, { result: false, values: new Set()});
}

/**
 *
 * @param params
 * @returns {{result: number, advantages: Set<string>, disadvantages: Set<string>}}
 */
function getAttackAdvantages (...params) {
    const a = evaluateObject(oAdvantages, ...params);
    const d = evaluateObject(oDisadvantages, ...params);
    const  result = (a.result ? 1 : 0) + (d.result ? -1 : 0);
    return {
        advantages: a.values,
        disadvantages: d.values,
        result
    };
}

module.exports = {
    getAttackAdvantages
};
