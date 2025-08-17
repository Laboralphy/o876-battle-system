/**
 * Will update cooldown and charges as action is being used
 * @param state {RBSStoreState}
 * @param getters {RBSStoreGetters}
 * @param action {string}
 * @param time {number} time
 */
module.exports = ({ state, getters }, { action, time }) => {
    /**
     * @var oAction {RBSAction}
     */
    const oAction = state.actions[action];
    if (oAction) {
        const ready = getters.getActions[action].ready;
        if (ready) {
            oAction.cooldownTimer.push(oAction.cooldown);
            return true;
        } else {
            return false;
        }
    }
};
