const CONSTS = require('../../../../consts');

/**
 * Attacking when poisoned imposes a disadvantage
 * @param attackOutcome {AttackOutcome}
 * @returns {boolean}
 */
function main (attackOutcome) {
    return attackOutcome.attacker.getters.getConditionSet.has(CONSTS.CONDITION_POISONED);
}

module.exports = main;
