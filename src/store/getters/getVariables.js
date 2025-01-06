/**
 *
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @param externals {{VARIABLES: {[variable: string]: number|string}}}
 * @returns {{[variable: string]: number|string}}
 */
module.exports = (state, getters, externals) => externals.VARIABLES