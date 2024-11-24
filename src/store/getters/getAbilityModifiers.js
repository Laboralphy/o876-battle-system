const { shallowMap } = require("@laboralphy/object-fusion");

/**
 * List of all ability modifiers
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @param externals {{}}
 * @returns {Object<string, number>}
 */
module.exports = (state, getters, externals) => {
    return shallowMap(getters.getAbilities, value => Math.floor((value - 10) / 2))
}