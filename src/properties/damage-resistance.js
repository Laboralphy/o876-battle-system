const CONSTS = require('../consts')

/**
 * This property will half damages received from a certain type
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