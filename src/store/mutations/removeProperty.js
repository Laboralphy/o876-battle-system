/**
 * Remove a property
 * @param state {RBSStoreState}
 * @param property {RBSProperty}
 */
module.exports = ({ state }, { property }) => {
    const iProp = state.properties.findIndex(p => p.id = property.id);
    if (iProp >= 0) {
        state.property.splice(iProp, 1);
    }
};
