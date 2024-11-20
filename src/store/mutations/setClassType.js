/**
 * Défine a new value for class type
 * @param state {RBSStoreState}
 * @param value {string} CLASS_TYPE_*
 */
module.exports = ({ state }, { value }) => {
    state.classType = value
}