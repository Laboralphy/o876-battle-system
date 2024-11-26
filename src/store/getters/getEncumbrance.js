const CONSTS = require('../../consts')

/**
 * returns the amount of current hit points
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @param externals {*}
 * @returns {{value: number, capacity: number}}
 */
module.exports = (state, getters, externals) => {
    const capacity = getters.getAbilities[CONSTS.ABILITY_STRENGTH] * 10
    const value = state.encumbrance
    const factor = Math.max(0, Math.min(1, 1 - (value - capacity) / capacity))
    return {
        value,
        capacity,
        factor
    }
}
