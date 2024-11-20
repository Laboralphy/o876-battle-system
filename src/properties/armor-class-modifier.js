const CONSTS = require('../consts')

/**
 * This property will add a bonus or penalty to armor class.
 * "amp" register hold the modifier value
 * @param property {RBSProperty}
 * @param damageType {string} DAMAGE_TYPE_*
 * @param attackType {string} ATTACK_TYPE_*
 */
function init ({ property, damageType = CONSTS.DAMAGE_TYPE_ANY, attackType = CONSTS.ATTACK_TYPE_ANY }) {
    if (!CONSTS[damageType]) {
        throw new ReferenceError('unknown damage type ' + damageType)
    }
    if (!CONSTS[attackType]) {
        throw new ReferenceError('unknown attack type ' + attackType)
    }
    property.data.damageType = damageType
    property.data.attackType = attackType
}

module.exports = {
    init
}
