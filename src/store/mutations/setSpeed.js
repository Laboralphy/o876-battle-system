/**
 * Défine a new value for moving speed
 * @param state {RBSStoreState}
 * @param value {number}
 */
module.exports = ({ state }, { value }) => {
    state.speed = Math.max(0, value)
}
