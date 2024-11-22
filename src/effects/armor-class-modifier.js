const CONSTS = require('../consts')
const { checkConst } = require("../libs/check-const");

/**
 * This effect modifies armor class. Can be restricted to certain type of damage, or certain type of attack
 * @param effect
 * @param damageType {string} DAMAGE_TYPE_*
 * @param attackType {string} ATTACK_TYPE_*
 */
function init ({ effect, damageType = CONSTS.DAMAGE_TYPE_ANY, attackType = CONSTS.ATTACK_TYPE_ANY }) {
    effect.data.damageType = checkConst(damageType)
    effect.data.attackType = checkConst(attackType)
}

module.exports = {
    init
}
