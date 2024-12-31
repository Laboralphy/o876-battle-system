const CONSTS = require('../../consts')
const { aggregateModifiers } = require('../../libs/aggregator')
const { shallowMap } = require('@laboralphy/object-fusion')
const {filterAbility} = require("../../libs/props-effects-filters");

/**
 * List of all ability modifiers
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @returns {Object<string, number>}
 */
module.exports = (state, getters) => {
    const { sorter } = aggregateModifiers([
            CONSTS.EFFECT_ABILITY_MODIFIER,
            CONSTS.PROPERTY_ABILITY_MODIFIER
        ],
        getters,
        {
            effectSorter: filterAbility,
            propSorter: filterAbility
        }
    )
    return shallowMap(state.abilities, (nValue, sAbility) => {
        const nModifier = (sAbility in sorter) ? sorter[sAbility].sum : 0
        return Math.max(1, nValue + nModifier)
    })
}
