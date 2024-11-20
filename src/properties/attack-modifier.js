const CONSTS = require('../consts')

/**
 * This property add bonus or penalty to attack bonus, using "amp" register to hold the modifier value.
 * @param property
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