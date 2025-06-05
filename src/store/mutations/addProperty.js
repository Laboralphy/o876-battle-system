const PropertyBuilder = require('../../PropertyBuilder');
/**
 * Adds a new property
 * @param state {RBSStoreState}
 * @param property {RBSProperty}
 */
module.exports = ({ state }, { property }) => {
    if (!state.properties.some(p => p.id === property.id)) {
        state.properties.push(property);
    }
};
