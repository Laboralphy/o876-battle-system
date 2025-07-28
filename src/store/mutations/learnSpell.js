/**
 * Add a new spell in spell book
 * @param state {RBSStoreState}
 * @param spell {string}
 */
module.exports = ({ state }, { spell }) => {
    state.spells[spell] = {
        prepared: false
    };
};
