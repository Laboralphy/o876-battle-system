const CONSTS = require('../../../../consts');

/**
 *
 * @param savingThrowOutcome {SavingThrowOutcome}
 * @return {boolean}
 */
function main (savingThrowOutcome) {
    // Should return true if restrained or stunned
    return savingThrowOutcome.ability === CONSTS.ABILITY_DEXTERITY &&
        !savingThrowOutcome.creature.getters.getCapabilitySet.has(CONSTS.CAPABILITY_MOVE);
}

module.exports = main;
