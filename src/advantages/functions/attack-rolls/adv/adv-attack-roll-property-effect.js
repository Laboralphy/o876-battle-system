const CONSTS = require('../../../../consts');
const { aggregateModifiers } = require('../../../../libs/aggregator');

/**
 * An effect or item property may cause advantage.
 * A short duration effect like "true strike" will grant advantage
 * An item having attack advantage property would be considered as unfair
 * @param attackOutcome {AttackOutcome}
 * @returns {boolean}
 */
function main (attackOutcome) {
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
}

module.exports = main;
