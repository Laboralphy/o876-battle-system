const CONSTS = require('../../consts')

/**
 * @param state {RBSStoreState}
 * @param id {string}
 * @param attackType {string}
 * @param cooldown {number}
 * @param cooldownTimer {number}
 * @param charges {number}
 * @param dailyCharges {number}
 * @param range {number}
 * @param onHit {string}
 * @param parameters {{}}
 */
module.exports = ({ state }, {
    id,
    attackType = CONSTS.COMBAT_ACTION_TYPE_SPELL_LIKE_ABILITY,
    cooldown = 0,
    charges = 0,
    range = Infinity,
    onHit,
    parameters = {}
}) => {
    const oNewAction = {
        attackType,
        cooldown,
        cooldownTimer: 0,
        charges,
        dailyCharges: charges,
        range,
        onHit,
        parameters
    }
    state.actions = {
        ...state.actions,
        [id]: oNewAction
    }
}