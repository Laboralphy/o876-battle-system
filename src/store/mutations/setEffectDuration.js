/**
 * Change an effect duration. Setting duration to 0 will remove effect from creatures
 * @param state {*}
 * @param effect {RBSEffect}
 * @param duration {number}
 */
module.exports = ({ state }, { effect, duration }) => {
    const oEffect = state.effects[effect.id]
    if (oEffect) {
        oEffect.duration = duration
    } else {
        throw new Error(`effect ${effect.id} not found.`)
    }
}