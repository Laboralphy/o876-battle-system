const CONSTS = require('../consts')

/**
 * This property will reduce damages received by a certain amount
 * @param property {RBSProperty}
 * @param sDamageType {string} DAMAGE_TYPE_*
 */
function init ({ property, damageType: sDamageType }) {
    if (!CONSTS[sDamageType]) {
        throw new ReferenceError('unknown damage type ' + sDamageType)
    }
    property.data.damageType = sDamageType
}

module.exports = {
    init
}