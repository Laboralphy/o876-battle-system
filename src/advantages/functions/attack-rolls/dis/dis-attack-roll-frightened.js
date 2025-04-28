const CONSTS = require('../../../../consts');

/**
 * Attacking when rooted imposes a disadvantage
 * @param attackOutcome {AttackOutcome}
 * @returns {boolean}
 */
function main (attackOutcome) {
    return attackOutcome.attacker.getters.getConditionSet.has(CONSTS.CONDITION_FRIGHTENED);
}

module.exports = main;
