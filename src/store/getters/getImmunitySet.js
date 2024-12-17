const CONSTS = require('../../consts')
const { aggregateModifiers } = require('../../libs/aggregator')

/**
 * Returns a Set containing all immunities
 *
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @returns {Set<string>}
 */
module.exports = (state, getters) => {
    const { sorter: oImmunities } = aggregateModifiers([
        CONSTS.EFFECT_IMMUNITY,
        CONSTS.PROPERTY_IMMUNITY
    ], getters, {
        effectSorter: effect => effect.data.immunityType,
        propSorter: prop => prop.data.immunityType
    })
    return new Set(Object.keys(oImmunities))
}
