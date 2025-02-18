const { checkConst } = require('../libs/check-const');

/**
 * This property adds a damage type to a weapon.
 * this can only be applied to a weapon.
 * Example : all bec-de-corbin should be of damageType crushing and should have piercing as additional damageType
 * @param property
 * @param damageType {string} DAMAGE_TYPE_*
 */
function init ({ property, damageType }) {
    property.data.damageType = checkConst(damageType);
}

module.exports = {
    init
};
