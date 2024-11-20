const CONSTS = require('../consts')

/**
 * This property will add bonus or penalty to a weapon damage
 * @param property {RBSProperty}
 * @param sDamageType {string} DAMAGE_TYPE_*
 */
function init ({ property, damageType: sDamageType = CONSTS.DAMAGE_TYPE_ANY }) {
    if (!CONSTS[sDamageType]) {
        throw new ReferenceError('unknown damage type ' + sDamageType)
    }
    property.data.damageType = sDamageType
}

module.exports = {
    init
}