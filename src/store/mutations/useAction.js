/**
 * Will update cooldown and charges as action is being used
 * @param state {RBSStoreState}
 * @param idAction {string}
 */
module.exports = ({ state }, { action: idAction }) => {
    const oAction = state.actions[idAction]
    if (oAction) {
        if (oAction.cooldown > 0) {
            oAction.cooldownTimer = oAction.cooldown
        }
        if (oAction.dailyCharges > 0 && oAction.charges) {
            --oAction.charges
        }
    } else {
        throw new Error(`Unknown action ${idAction}`)
    }
}