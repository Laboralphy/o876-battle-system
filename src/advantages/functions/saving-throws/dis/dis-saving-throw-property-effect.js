const CONSTS = require('../../../../consts');
const { aggregateModifiers } = require('../../../../libs/aggregator');

/**
 * An effect or item property may impose disadvantage to saving throw.
 * @param savingThrow {SavingThrowOutcome}
 * @returns {boolean}
 */
function main (savingThrow) {
    const f = propOrEffect => propOrEffect.data.ability === savingThrow.ability || propOrEffect.data.ability === savingThrow.threat;

    return aggregateModifiers([
        CONSTS.PROPERTY_DISADVANTAGE_SAVING_THROW,
        CONSTS.EFFECT_DISADVANTAGE_SAVING_THROW
    ], savingThrow.creature.getters, {
        propFilter: f,
        effectFilter: f
    }).count > 0;
}

module.exports = main;
