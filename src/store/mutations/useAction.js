/**
 * Will update cooldown and charges as action is being used
 * @param state {RBSStoreState}
 * @param idAction {string}
 */
module.exports = ({ state }, { action: idAction }) => {
    /**
     * @var {RBSStoreStateAction}
     */
    const oAction = state.actions[idAction]
    if (oAction) {
        if (oAction.limited) {
            oAction.cooldownTimer.push(oAction.cooldown)
            console.log(oAction)
        }
    } else {
        throw new Error(`Unknown action ${idAction}`)
    }
}