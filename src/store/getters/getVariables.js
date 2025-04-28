/**
 *
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @param externals {{VARIABLES: {[variable: string]: number|string}}}
 * @returns {Object<string, number|string>}
 */
module.exports = (state, getters, externals) => externals.VARIABLES;
