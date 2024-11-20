/**
 *
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @returns {RBSProperty[]}
 */
module.exports = (state, getters) => [
    ...getters.getInnateProperties,
    ...Object.values(getters.getSlotProperties).flat()
]