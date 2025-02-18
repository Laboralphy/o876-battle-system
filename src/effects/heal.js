const CONSTS = require('../consts');
const {aggregateModifiers} = require('../libs/aggregator');

/**
 *
 * @param effect {RBSEffect}
 * @param target {Creature}
 */
function mutate ({ effect: oEffect, target, source }) {
    let nFactor = 1;
    const f = ({ amp }) => {
        nFactor *= amp;
    };
    aggregateModifiers([
        CONSTS.PROPERTY_HEALING_FACTOR
    ], target.getters, {
        propForEach: f,
        effectForEach: f
    });
    // If one single effect applies -100% this is a healing nullifier
    const nHealAmount = oEffect.amp;
    const nHealAmountAmplified = Math.floor(nHealAmount * nFactor);
    target.hitPoints += nHealAmountAmplified;
    target.events.emit(CONSTS.EVENT_CREATURE_HEAL, {
        healer: source,
        amount: nHealAmountAmplified,
        factor: nFactor,
        baseAmount: nHealAmount
    });
}

module.exports = {
    mutate
};
