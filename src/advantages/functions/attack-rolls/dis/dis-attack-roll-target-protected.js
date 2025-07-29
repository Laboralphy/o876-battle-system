const CONSTS = require('../../../../consts');

/**
 * Attacking a protected target when being an evil creature leads to a disadvantage on attack rolls
 * @param attackOutcome {AttackOutcome}
 * @returns {boolean}
 */
function main (attackOutcome) {
    /**
     * @type {Creature}
     */
    const oAttacker = attackOutcome.attacker;
    /**
     * @type {Creature}
     */
    const oTarget = attackOutcome.target;
    return oTarget.getters.getEffectSet.has(CONSTS.EFFECT_PROTECTION_FROM_EVIL) && oAttacker.getters.isSpecieEvil;
}

module.exports = main;
