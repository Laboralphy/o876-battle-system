/**
 * change creatures hit die (max hp per level)
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @param value {number}
 */
module.exports = ({ state, getters }, { value }) => {
    if (isNaN(value)) {
        throw new TypeError('hit die value should be a number ; got ' + (typeof value))
    }
    if (value < 1) {
        throw new Error('hit die value should be 1 or more')
    }
    state.hitDie = Math.max(1, value)
}