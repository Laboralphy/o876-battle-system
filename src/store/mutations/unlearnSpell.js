/**
 * Remove a spell from spell book
 * @param state {RBSStoreState}
 * @param spell {string}
 * @param getters {RBSStoreGetters}
 */
module.exports = ({ state, getters }, { spell }) => {
    const iSpell = state.spells.indexOf(spell);
    if (iSpell >= 0) {
        state.spells.splice(iSpell, 1);
    }
};
