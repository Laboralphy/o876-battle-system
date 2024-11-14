/**
 * Removes an effect from creature
 * @param state {*}
 * @param effect {RBSEffect}
 */
module.exports = ({ state }, { effect }) => {
    delete state.effects[effect.id]
}
