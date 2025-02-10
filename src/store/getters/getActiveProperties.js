const PropertyBuilder = require('../../PropertyBuilder')
/**
 * Return an array with active properties
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @returns {RBSProperty[]}
 */
module.exports = (state, getters) => {
    return getters.getProperties.filter(property => PropertyBuilder.isPropertyActive(property))
}