const {aggregateModifiers} = require('../../libs/aggregator');
const CONSTS = require('../../consts');
module.exports = (state, getters) => {
    const aSpecies = new Set();
    aggregateModifiers([
        CONSTS.PROPERTY_PROTECTION_FROM_SPECIES,
        CONSTS.EFFECT_PROTECTION_FROM_SPECIES
    ], getters, {
        effectForEach: eff => {
            for (const s of eff.data.species) {
                aSpecies.add(s);
            }
        }
    });
    return aSpecies;
};
