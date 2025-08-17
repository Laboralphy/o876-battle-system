/**
 * Add a new spell in spell book
 * @param state {RBSStoreState}
 * @param spell {string}
 * @param getters {RBSStoreGetters}
 */
module.exports = ({ state, getters }, { spell }) => {
    if (!getters.getLearnedSpellSet.has(spell)) {
        state.spells.push(spell);
    }
};
