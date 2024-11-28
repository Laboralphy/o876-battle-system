/**
 * @param state {RBSStoreState}
 * @param slot {string}
 */
module.exports = ({ state }, { slot }) => {
    state.offensiveSlot = slot
}
