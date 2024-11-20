/**
 * Adds a new property
 * @param state {RBSStoreState}
 * @param property {RBSProperty}
 */
module.exports = ({ state }, { property }) => {
    state.properties.push(property)
}