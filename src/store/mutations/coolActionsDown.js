/**
 * All actions are cooling down
 * @param state {RBSStoreState}
 */
module.exports = ({ state }) => {
    for (let sAction in state.actions) {
        const action = state.actions[sAction]
        if (action.cooldown > 0 && action.cooldownTimer > 0) {
            --action.cooldownTimer
        }
    }
}
