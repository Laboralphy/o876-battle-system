/**
 * Return a Set of effect tags, applied to creature
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @return {Set<string>}
 */
module.exports = (state, getters) => getters.getEffects.reduce((prev, curr) => prev.add(curr.tag), new Set())