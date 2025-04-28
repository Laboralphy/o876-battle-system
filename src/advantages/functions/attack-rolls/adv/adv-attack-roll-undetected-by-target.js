const CONSTS = require('../../../../consts');

/**
 * Attacking an unaware target (because attacker is invisible, stealth, or in dark area) grants an advantage
 * @param attackOutcome {AttackOutcome}
 * @returns {boolean}
 */
function main (attackOutcome) {
    return attackOutcome.target.getCreatureVisibility(attackOutcome.attacker) !== CONSTS.CREATURE_VISIBILITY_VISIBLE;
}

module.exports = main;
