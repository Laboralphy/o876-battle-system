/**
 * Returns the number of spell that can be prepared
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @returns {number}
 */
module.exports = (state, getters) =>
    getters.getAbilityModifiers[getters.getSpellCastingAbility];
