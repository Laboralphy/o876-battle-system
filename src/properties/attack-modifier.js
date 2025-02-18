const CONSTS = require('../consts');
const {checkConst} = require('../libs/check-const');

/**
 * This property add bonus or penalty to attack bonus, using "amp" register to hold the modifier value.
 * @param property
 * @param attackType {string} ATTACK_TYPE_*
 */
function init ({ property, attackType = CONSTS.ATTACK_TYPE_ANY }) {
    property.data.attackType = checkConst(attackType);
}

module.exports = {
    init
};
