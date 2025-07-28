/**
 * Remove a spell from spell book
 * @param state {RBSStoreState}
 * @param spell {string}
 */
module.exports = ({ state }, { spell }) => {
    delete state.spells[spell];
};
