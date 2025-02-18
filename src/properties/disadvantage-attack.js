const { checkConst } = require('../libs/check-const');
const CONSTS = require('../consts');

/**
 * This property will apply a disadvantage on a d20 attack roll
 * @param property {RBSProperty}
 * @param attackType {string} ATTACK_TYPE_*
 */
function init ({ property, attackType = CONSTS.ATTACK_TYPE_ANY }) {
    property.data.attackType = checkConst(attackType);
}

module.exports = {
    init
};
