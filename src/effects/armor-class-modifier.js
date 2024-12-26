const CONSTS = require('../consts')
const { checkConst } = require("../libs/check-const");

/**
 * This effect modifies armor class. Can be restricted to certain type of damage, or certain type of attack
 * @param effect
 * @param damageType {string} DAMAGE_TYPE_*
 * @param attackType {string} ATTACK_TYPE_*
 */
function init ({ effect, damageType = undefined, attackType = undefined }) {
    if (damageType === CONSTS.DAMAGE_TYPE_ANY) {
        throw new Error('Armor class modifier prop/effect : damage type should not be ANY ; choose damageType:NONE and attackType:ANY')
    }
    if (damageType === undefined && attackType === undefined) {
        // basic protection against all attack types, no bonus against specific damage type
        effect.data.attackType = CONSTS.ATTACK_TYPE_ANY
    } else if (damageType !== undefined && attackType !== undefined) {
        throw new Error('Property or effect : cannot specify both attackType and damageType on the same effect')
    } else {
        effect.data.damageType = checkConst(damageType, true)
        effect.data.attackType = checkConst(attackType, true)
    }
}

/**
 * Effect will be rejected if amp is negative and target is immune to armor class decrease
 * @param effect {RBSEffect}
 * @param target {Creature}
 * @param reject {function}
 */
function apply ({ effect, target, reject }) {
    if (effect.amp < 0 && target.getters.getImmunitySet.has(CONSTS.IMMUNITY_TYPE_AC_DECREASE)) {
        reject()
    }
}

module.exports = {
    init,
    apply
}
