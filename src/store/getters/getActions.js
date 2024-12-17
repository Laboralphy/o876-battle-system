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
module.exports = state => Object.fromEntries(
    Object
    .entries(state.actions)
    .map(([id, action]) => [id, {
        id,
        attackType: action.attackType,
        cooldown: action.cooldownTimer,
        charges: action.charges,
        range: action.range,
        onHit: action.onHit,
        parameters: action.parameters,
        ready: action.cooldownTimer === 0 && (action.dailyCharges === 0 || action.charges > 0)
    }]))
