const CONSTS = require('../../consts')

/**
 * @typedef RBSStoreStateAction {object}
 * @property id {string}
 * @property limited {boolean} if true, the action has limited use (limited charges, or/and limited cooldown)
 * @property actionType {string} COMBAT_ACTION_TYPE_*
 * @property cooldown {number}
 * @property cooldownTimer {number}
 * @property dailyCharges {number}
 * @property range {number}
 * @property script {string}
 * @property parameters {{}}
 *
 * @param state {RBSStoreState}
 * @param id {string}
 * @param actionType {string}
 * @param cooldown {number}
 * @param charges {number}
 * @param range {number}
 * @param script {string}
 * @param parameters {{}}
 */
module.exports = ({ state }, {
    id,
    actionType = CONSTS.COMBAT_ACTION_TYPE_SPELL_LIKE_ABILITY,
    cooldown = 0,
    charges = 0,
    range = Infinity,
    script,
    parameters = {}
}) => {
    const bHasCooldown = cooldown > 0
    const bHasCharges = charges > 0
    const s = (bHasCooldown ? 10 : 0) + (bHasCharges ? 1 : 0)
    let limited = false
    switch (s) {
        case 1: {
            // has no cooldown but has charges, this is typically an action with a number of uses per day
            cooldown = Infinity
            limited = true
            break
        }
        case 10: {
            // has cooldown but no charge : set charges to 1
            charges = 1
            limited = true
            break
        }
        case 11: {
            // has coolddown and charges
            limited = true
            break
        }
    }
    if (!id) {
        throw new Error('This action has no ID')
    }
    state.actions[id] = {
        id,
        actionType,
        limited,
        cooldown,
        cooldownTimer: [],
        dailyCharges: charges,
        range,
        script,
        parameters
    }
}