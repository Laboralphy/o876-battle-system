/**
 * Défine a new value for encumbrance
 * @param state {RBSStoreState}
 * @param value {number}
 */
module.exports = ({ state }, { value }) => {
    state.encumbrance = value;
};
