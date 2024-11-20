const CONSTS = require('../consts')

/**
 * This property change the number of attacks one can deliver each turn
 * "amp" register holds the modifier value
 * @param property {RBSProperty}
 * @param attackType {string}
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