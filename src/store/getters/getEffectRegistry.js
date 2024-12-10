/**
 * Produces a dictionnary of id => effect
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @returns {Object<string, RBSEffect>}
 */
module.exports = (state, getters) => {
    const oRegistry = {}
    getters.getEffects.forEach(effect => {
        oRegistry[effect.id] = effect
    })
    return oRegistry
}