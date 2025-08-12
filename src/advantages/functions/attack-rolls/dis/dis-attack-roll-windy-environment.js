const CONSTS = require('../../../../consts');

/**
 * Attacking with ranged weapon in a windy environment imposes a disadvantage
 * @param attackOutcome {AttackOutcome}
 * @returns {boolean}
 */
function main (attackOutcome) {
    return !!attackOutcome.attacker.getters.getEnvironments[CONSTS.ENVIRONMENT_WINDY] &&
        attackOutcome.attackType === CONSTS.ATTACK_TYPE_RANGED;
}

module.exports = main;
