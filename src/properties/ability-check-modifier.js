const { checkConst } = require('../libs/check-const');

/**
 * This property modifies an ability check, adding a bonus (if amp > 0) or a penalty (if amp < 0)
 * @param property {RBSProperty}
 * @param ability {string} ABILITY_*
 */
function init ({ property, ability = undefined }) {
    if (ability) {
        property.data.ability = checkConst(ability);
        property.data.unviversal = false;
    } else {
        property.data.unviversal = true;
    }
}

module.exports = {
    init
};
