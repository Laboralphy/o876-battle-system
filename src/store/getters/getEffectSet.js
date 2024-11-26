/**
 * Return a Set with all effects
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @returns {Set<string>}
 */
module.exports = (state, getters) =>
    getters.getEffects.reduce((prev, curr) => prev.add(curr.type), new Set())