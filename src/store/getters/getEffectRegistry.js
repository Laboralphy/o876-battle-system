/**
 * Produces a dictionnary of id => effect
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @returns {Object<string, RBSEffect>}
 */
module.exports = (state, getters) =>
    Object.fromEntries(getters.getEffects.map(effect => [effect.id, effect]));
