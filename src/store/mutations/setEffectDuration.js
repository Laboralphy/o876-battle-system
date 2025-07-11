/**
 * Change an effect duration. Setting duration to 0 will remove effect from creatures
 * @param state {*}
 * @param getters {RBSStoreGetters}
 * @param effect {RBSEffect}
 * @param duration {number}
 * @param [depletionDelay] {number}
 */
module.exports = ({ state, getters }, { effect, duration, depletionDelay = undefined }) => {
    const oEffect = getters.getEffectRegistry[effect.id];
    if (oEffect) {
        oEffect.duration = duration;
        if (depletionDelay !== undefined) {
            oEffect.depletionDelay = depletionDelay;
        }
    } else {
        const sEffectList = Object.keys(getters.getEffectRegistry).join(', ');
        throw new Error(`effect ${effect.id} not found. ${sEffectList}`);
    }
};
