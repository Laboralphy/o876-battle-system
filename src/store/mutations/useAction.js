/**
 * Will update cooldown and charges as action is being used
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @param idAction {string}
 * @param time {number} time
 */
module.exports = ({ state, getters }, { action: idAction, time }) => {
    /**
     * @var oAction {RBSAction}
     */
    const oAction = state.actions[idAction];
    if (oAction) {
        const ready = getters.getActions[idAction].ready;
        if (ready) {
            oAction.cooldownTimer.push(oAction.cooldown);
            return true;
        } else {
            return false;
        }
    }
};
