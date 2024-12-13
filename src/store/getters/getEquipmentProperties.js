/**
 *
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @returns {RBSProperty[]}
 */
module.exports = (state, getters) => Object.values(getters.getSlotProperties).flat()