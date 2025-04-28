const CONSTS = require('../../../../consts');
const { aggregateModifiers } = require('../../../../libs/aggregator');

/**
 * An effect or item property may cause advantage to saving throw.
 * Some races have advantages on saving throw
 * example : dwarf have advantage on poison saving throws
 * and halflings have advantage on fear saving throw
 * and elves have advantage on charm saving throw
 * @param savingThrow {SavingThrowOutcome}
 * @returns {boolean}
 */
function main (savingThrow) {
    const f = propOrEffect => propOrEffect.data.ability === savingThrow.ability || propOrEffect.data.ability === savingThrow.threat;

    return aggregateModifiers([
        CONSTS.PROPERTY_ADVANTAGE_SAVING_THROW,
        CONSTS.EFFECT_ADVANTAGE_SAVING_THROW
    ], savingThrow.creature.getters, {
        propFilter: f,
        effectFilter: f
    }).count > 0;
}

module.exports = main;
