/**
 * Défine a new value for level
 * @param state {RBSStoreState}
 * @param value {number}
 */
module.exports = ({ state }, { value }) => {
    state.level = Math.max(1, value);
};
