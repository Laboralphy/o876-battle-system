const CONSTS = require('../../consts')

/**
 * only ATTACK_TYPE_MELEE or ATTACK_TYPE_ANY are used to specify attack or ac bonus
 * @param effectOrProp {{ data: { attackType: string }}}
 * @returns {boolean}
 */
function filterMeleeAttackTypes (effectOrProp) {
    return effectOrProp.data.attackType === CONSTS.ATTACK_TYPE_MELEE ||
        effectOrProp.data.attackType === CONSTS.ATTACK_TYPE_ANY
}

/**
 * only ATTACK_TYPE_MELEE or ATTACK_TYPE_ANY are used to specify attack or ac bonus
 * @param effectOrProp {{ data: { attackType: string }}}
 * @returns {boolean}
 */
function filterRangedAttackTypes (effectOrProp) {
    return effectOrProp.data.attackType === CONSTS.ATTACK_TYPE_RANGED ||
        effectOrProp.data.attackType === CONSTS.ATTACK_TYPE_ANY
}

/**
 * only ATTACK_TYPE_MELEE_TOUCH or ATTACK_TYPE_ANY are used to specify attack or ac bonus
 * @param effectOrProp {{ data: { attackType: string }}}
 * @returns {boolean}
 */
function filterMeleeTouchAttackTypes (effectOrProp) {
    return effectOrProp.data.attackType === CONSTS.ATTACK_TYPE_MELEE_TOUCH ||
        effectOrProp.data.attackType === CONSTS.ATTACK_TYPE_ANY
}

/**
 * only ATTACK_TYPE_RANGED_TOUCH or ATTACK_TYPE_ANY are used to specify attack or ac bonus
 * @param effectOrProp {{ data: { attackType: string }}}
 * @returns {boolean}
 */
function filterRangedTouchAttackTypes (effectOrProp) {
    return effectOrProp.data.attackType === CONSTS.ATTACK_TYPE_RANGED_TOUCH ||
        effectOrProp.data.attackType === CONSTS.ATTACK_TYPE_ANY
}

module.exports = {
    filterMeleeAttackTypes,
    filterRangedAttackTypes,
    filterMeleeTouchAttackTypes,
    filterRangedTouchAttackTypes
}
