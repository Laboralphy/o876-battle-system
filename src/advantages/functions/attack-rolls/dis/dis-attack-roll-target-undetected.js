const CONSTS = require('../../../../consts');

/**
 * Attacking an undetected target (invisible, or in dark area) imposes a disadvantage
 * @param attackOutcome {AttackOutcome}
 * @returns {boolean}
 */
function main (attackOutcome) {
    return attackOutcome.attacker.getCreatureVisibility(attackOutcome.target) !== CONSTS.CREATURE_VISIBILITY_VISIBLE;
}

module.exports = main;
