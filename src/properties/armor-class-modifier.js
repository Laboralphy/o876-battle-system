const CONSTS = require('../consts');
const { checkConst } = require('../libs/check-const');

/**
 * This property will add a bonus or penalty to armor class.
 * "amp" register hold the modifier value
 * @param property {RBSProperty}
 * @param attackType {string} ATTACK_TYPE_*
 * @param damageType {string} DAMAGE_TYPE_*
 */
function init ({ property, damageType = undefined, attackType = undefined }) {
    if (damageType === CONSTS.DAMAGE_TYPE_ANY) {
        throw new Error('Armor class modifier prop/effect : damage type should not be ANY ; choose damageType:NONE and attackType:ANY');
    }
    if (damageType === undefined && attackType === undefined) {
        // basic protection against all attack types, no bonus against specific damage type
        property.data.attackType = CONSTS.ATTACK_TYPE_ANY;
    } else if (damageType !== undefined && attackType !== undefined) {
        throw new Error('Property or effect : cannot specify both attackType and damageType on the same effect');
    } else {
        property.data.damageType = checkConst(damageType, true);
        property.data.attackType = checkConst(attackType, true);
    }
}


module.exports = {
    init
};
