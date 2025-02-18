const CONSTS = require('../consts');
const {checkConst} = require('../libs/check-const');

/**
 * This property will half damages received from a certain type
 * @param property {RBSProperty}
 * @param sDamageType {string} DAMAGE_TYPE_*
 */
function init ({ property, damageType: sDamageType }) {
    property.data.damageType = checkConst(sDamageType);
}

module.exports = {
    init
};
