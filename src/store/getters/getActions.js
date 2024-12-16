/**
 * @typedef RBSStoreGettersGetAction {object}
 * @property id {string}
 * @property attackType {string}
 * @property cooldown {number}
 * @property cooldownTimer {number}
 * @property charges {number}
 * @property dailyCharges {number}
 * @property range {number}
 * @property onHit {string}
 * @property parameters {{}}
 * @property ready {boolean}
 *
 * @param state {RBSStoreState}
 * @returns {{ [id: string]: RBSStoreGettersGetAction }}
 */
module.exports = state => Object
    .entries(state.actions)
    .filter(([, action]) => action.cooldown === 0 && (action.dailyCharges === 0 || action.charges > 0))
    .map(([id, action]) => ({
        id,
        attackType: action.attackType,
        cooldown: action.cooldownTimer,
        charges: action.charges,
        range: action.range,
        onHit: action.onHit,
        parameters: action.parameters,
        ready: action.cooldown === 0 && (action.dailyCharges === 0 || action.charges > 0)
    }))
    .reduce((prev, [id, action]) => {
        prev[id] = action
    }, {})
