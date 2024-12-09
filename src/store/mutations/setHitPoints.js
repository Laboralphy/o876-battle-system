/**
 * change creatures hit points
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @param value {number}
 */
module.exports = ({ state, getters }, { value }) => {
    if (isNaN(value)) {
        throw new Error('HP value is not a number: ' + value)
    }
    state.pools.hitPoints = Math.max(0, Math.min(getters.getMaxHitPoints, value))
}