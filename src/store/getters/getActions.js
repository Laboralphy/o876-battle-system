const CONSTS = require('../../consts')

/**
 * @typedef RBSAction {object}
 * @property id {string} id of action
 * @property limited {boolean} if true, then this action has limited use
 * @property attackType {string} attack type
 * @property cooldown {number} if > 0 then the action cannot be used until 0
 * @property charges {number} number of uses left
 * @property recharging {boolean} if true then this action is recharging (need to call rechargeActions regularly
 * @property range {number} action range
 * @property script {string} script to call if action hits
 * @property parameters {{}} parameters passed to script
 * @property ready {boolean} if true this action is ready to use, else, action cannot be used
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
        const recharging = acdtl > 0
        const charges = action.dailyCharges - acdtl // remaining charge for that day
        const cooldown = (!action.limited || charges > 0)
            ? 0
            : acdt[0]
        const ready = action.limited ? charges > 0 : true
        const oAction = {
                id,
                limited: action.limited,
                actionType: action.actionType,
                cooldown,
                charges,
                recharging,
                range: action.range,
                script: action.script,
                parameters: action.parameters,
                ready
        }
        return [id, oAction]
    })
)
