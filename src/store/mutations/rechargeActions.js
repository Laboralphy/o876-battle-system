/**
 * @param action {RBSStoreStateAction}
 */
function cooldownAction (action) {
    if (action.cooldown > 0 && action.cooldown !== Infinity) {
        const acdt = action.cooldownTimer
        for (let i = acdt.length - 1; i >= 0; --i) {
            --acdt[i]
            if (acdt[i] <= 0) {
                acdt.splice(i, 1)
            }
        }
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
