/**
 * Change an effect duration. Setting duration to 0 will remove effect from creatures
 * @param state {*}
 * @param effect {RBSEffect}
 * @param getters {RBSStoreGetters}
 * @param duration {number}
 */
module.exports = ({ state, getters }, { effect, duration }) => {
    const oEffect = getters.getEffectRegistry[effect.id]
    if (oEffect) {
        oEffect.duration = duration
    } else {
        const sEffectList = Object.keys(getters.getEffectRegistry).join(', ')
        throw new Error(`effect ${effect.id} not found. ${sEffectList}`)
    }
}