/**
 * @param action {RBSStoreStateAction}
 */
function cooldownAction (action) {
    if (action.cooldown > 0) {
        const a = action.cooldownTimer.map(n => n - 1).filter(n => n > 0)
        action.cooldownTimer.splice(0, action.cooldownTimer.length, ...a)
    }
}

/**
 * All actions are cooling down if
 * @param state {RBSStoreState}
 */
module.exports = ({ state }) => {
    for (let sAction in state.actions) {
        cooldownAction(state.actions[sAction])
    }
}
