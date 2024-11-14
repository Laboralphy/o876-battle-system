/**
 * Applies a non-instant effect on a creature
 * @param state {*}
 * @param effect {RBSEffect}
 * @returns {RBSEffect}
 */
module.exports = ({ state }, { effect }) => {
    const id = effect.id
    if (id in state.effects) {
        throw new Error(`An effect with the same id ${id} is already present in state`)
    }
    return state.effects[id] = effect
}
