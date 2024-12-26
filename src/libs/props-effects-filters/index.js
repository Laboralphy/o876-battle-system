const CONSTS = require('../../consts')

/**
 * filters ATTACK_TYPE_MELEE or ATTACK_TYPE_ANY to get the bonus
 * @param effectOrProp {{ data: { attackType: string }}}
 * @returns {boolean}
 */
function filterMeleeAttackTypes (effectOrProp) {
    return effectOrProp.data.attackType === CONSTS.ATTACK_TYPE_MELEE ||
        effectOrProp.data.attackType === CONSTS.ATTACK_TYPE_ANY
}

/**
 * filters ATTACK_TYPE_RANGED or ATTACK_TYPE_ANY to get the bonus
 * @param effectOrProp {{ data: { attackType: string }}}
 * @returns {boolean}
 */
function filterRangedAttackTypes (effectOrProp) {
    return effectOrProp.data.attackType === CONSTS.ATTACK_TYPE_RANGED ||
        effectOrProp.data.attackType === CONSTS.ATTACK_TYPE_ANY
}

/**
 * filters ATTACK_TYPE_MELEE_TOUCH or ATTACK_TYPE_ANY to get the bonus
 * @param effectOrProp {{ data: { attackType: string }}}
 * @returns {boolean}
 */
function filterMeleeTouchAttackTypes (effectOrProp) {
    return effectOrProp.data.attackType === CONSTS.ATTACK_TYPE_MELEE_TOUCH ||
        effectOrProp.data.attackType === CONSTS.ATTACK_TYPE_ANY
}

/**
 * filters ATTACK_TYPE_RANGED_TOUCH or ATTACK_TYPE_ANY to get the bonus
 * @param effectOrProp {{ data: { damageType: string }}}
 * @returns {boolean}
 */
function filterRangedTouchAttackTypes (effectOrProp) {
    return effectOrProp.data.attackType === CONSTS.ATTACK_TYPE_RANGED_TOUCH ||
        effectOrProp.data.attackType === CONSTS.ATTACK_TYPE_ANY
}

/**
 * filters DAMAGE_TYPE_SLASHING or DAMAGE_TYPE_ANY to get the bonus
 * @param effectOrProp {{ data: { damageType: string }}}
 * @returns {boolean}
 */
function filterSlashingDamageTypes (effectOrProp) {
    return effectOrProp.data.damageType === CONSTS.DAMAGE_TYPE_SLASHING ||
        effectOrProp.data.damageType === CONSTS.DAMAGE_TYPE_ANY
}

/**
 * filters DAMAGE_TYPE_CRUSHING or DAMAGE_TYPE_ANY to get the bonus
 * @param effectOrProp {{ data: { damageType: string }}}
 * @returns {boolean}
 */
function filterCrushingDamageTypes (effectOrProp) {
    return effectOrProp.data.damageType === CONSTS.DAMAGE_TYPE_CRUSHING ||
        effectOrProp.data.damageType === CONSTS.DAMAGE_TYPE_ANY
}

/**
 * filters DAMAGE_TYPE_PIERCING or DAMAGE_TYPE_ANY to get the bonus
 * @param effectOrProp {{ data: { damageType: string }}}
 * @returns {boolean}
 */
function filterPiercingDamageTypes (effectOrProp) {
    return effectOrProp.data.damageType === CONSTS.DAMAGE_TYPE_PIERCING ||
        effectOrProp.data.damageType === CONSTS.DAMAGE_TYPE_ANY
}

module.exports = {
    filterMeleeAttackTypes,
    filterRangedAttackTypes,
    filterMeleeTouchAttackTypes,
    filterRangedTouchAttackTypes,
    filterSlashingDamageTypes,
    filterCrushingDamageTypes,
    filterPiercingDamageTypes
}
