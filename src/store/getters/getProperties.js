/**
 *
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @returns {RBSProperty[]}
 */
module.exports = (state, getters) => [
    ...getters.getInnateProperties,
    ...getters.getEquipmentProperties
];
