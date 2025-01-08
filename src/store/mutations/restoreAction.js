/**
 * Will restore cooldown and charges values, making the action reusable
 * @param state {RBSStoreState}
 * @param idAction {string}
 */
module.exports = ({ state }, { action: idAction }) => {
    const oAction = state.actions[idAction]
    if (oAction) {
        oAction.cooldownTimer.splice(0, oAction.cooldownTimer.length)
    } else {
        throw new Error(`Unknown action ${idAction}`)
    }
}