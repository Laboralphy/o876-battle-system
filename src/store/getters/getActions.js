const CONSTS = require('../../consts')

/**
 * @typedef RBSAction {object}
 * @property id {string}
 * @property limited {boolean}
 * @property cooldown {number}
 * @property charges {number}
 * @property range {number}
 * @property onHit {string}
 * @property parameters {{}}
 * @property ready {boolean}
 *
 * @param state {RBSStoreState}
 * @returns {{ [id: string]: RBSAction }}
 */
module.exports = state => Object.fromEntries(
    Object
    .entries(state.actions)
    .map(([id, action]) => {
        const acdt = action.cooldownTimer
        const acdtl = acdt.length
        const charges = action.dailyCharges - acdtl // remaining charge for that day
            console.log(action)
        const cooldown = (!action.limited || charges > 0)
            ? 0
            : acdt[acdtl - 1]
        const ready = action.limited ? charges > 0 : true
        const oAction = {
                id,
                limited: action.limited,
                attackType: action.attackType,
                cooldown,
                charges,
                range: action.range,
                onHit: action.onHit,
                parameters: action.parameters,
                ready
        }
        return [id, oAction]
    })
)
