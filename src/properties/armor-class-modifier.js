const CONSTS = require('../consts')

/**
 * This property will add a bonus or penalty to armor class.
 * "amp" register hold the modifier value
 * @param property {RBSProperty}
 * @param attackType {string} ATTACK_TYPE_*
 */
function init ({ property, attackType = CONSTS.ATTACK_TYPE_ANY }) {
    if (!CONSTS[attackType]) {
        throw new ReferenceError('unknown attack type ' + attackType)
    }
    property.data.attackType = attackType
}

module.exports = {
    init
}
