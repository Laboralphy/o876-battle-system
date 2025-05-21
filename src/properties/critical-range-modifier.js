const CONSTS = require('../consts');
const {checkConst} = require('../libs/check-const');

/**
 * This property lowers critical range, making weapon more threatening
 * @param property {RBSProperty}
 * @param attackType {string} ATTACK_TYPE_*
 */
function init ({ property, attackType = CONSTS.ATTACK_TYPE_ANY }) {
    property.data.attackType = checkConst(attackType);
}

module.exports = {
    init
};
