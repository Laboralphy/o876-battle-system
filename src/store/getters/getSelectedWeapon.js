/**
 * Returns current selected weapon
 * @param state {RBSStoreState}
 * @returns {RBSItem|null}
 */
module.exports = state => state.equipment[state.selectedOffensiveSlot];
