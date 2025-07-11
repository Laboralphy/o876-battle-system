/**
 * Removes an effect from creature
 * @param state {RBSStoreState}
 * @param effect {RBSEffect}
 */
module.exports = ({ state }, { effect }) => {
    const iEffectIndex = state.effects.findIndex(eff => eff.id === effect.id);
    if (iEffectIndex >= 0) {
        state.effects.splice(iEffectIndex, 1);
    }
};
