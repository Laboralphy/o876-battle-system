const CONSTS = require('../../../../consts');
const { aggregateModifiers } = require('../../../../libs/aggregator');

/**
 *
 * @param attackOutcome {AttackOutcome}
 * @returns {boolean}
 */
function main (attackOutcome) {
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
}

module.exports = main;
