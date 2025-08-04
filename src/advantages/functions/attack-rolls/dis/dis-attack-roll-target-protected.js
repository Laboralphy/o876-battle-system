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
    return oTarget.getters.getSpecieProtectionSet.has(oAttacker.getters.getSpecie);
}

module.exports = main;
