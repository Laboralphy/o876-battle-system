/**
 *
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @param externals {*}
 * @returns {string}
 */
module.exports = (state, getters, externals) =>
    externals.CLASS_TYPES[getters.getClassType];
