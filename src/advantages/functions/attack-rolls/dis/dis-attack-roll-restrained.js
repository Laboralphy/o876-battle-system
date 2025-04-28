const CONSTS = require('../../../../consts');

/**
 * Attacking when rooted imposes a disadvantage
 * @param attackOutcome {AttackOutcome}
 * @returns {boolean}
 */
function main (attackOutcome) {
    return !attackOutcome.target.getters.getCapabilitySet.has(CONSTS.CAPABILITY_MOVE);
}

module.exports = main;
