/**
 * Will restore cooldown and charges values, making the action reusable
 * @param state {RBSStoreState}
 * @param idAction {string}
 */
module.exports = ({ state }, { action: idAction }) => {
    const oAction = state.actions[idAction]
    if (oAction) {
        oAction.cooldownTimer = 0
        oAction.charges = oAction.dailyCharges
    } else {
        throw new Error(`Unknown action ${idAction}`)
    }
}