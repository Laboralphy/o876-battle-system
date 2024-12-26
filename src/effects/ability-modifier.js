const { checkConst } = require('../libs/check-const')
const CONSTS = require("../consts");

/**
 * This effect modifies an ability, adding a bonus (if amp > 0) or a penalty (if amp < 0)
 * @param effect {RBSEffect}
 * @param ability {string} ABILITY_*
 */
function init ({ effect, ability }) {
    effect.data.ability = checkConst(ability)
}

/**
 * Effect will be rejected if amp is negative and target is immune to ability decrease
 * @param effect {RBSEffect}
 * @param target {Creature}
 * @param reject {function}
 */
function apply ({ effect, target, reject }) {
    if (effect.amp < 0 && target.getters.getImmunitySet.has(CONSTS.IMMUNITY_TYPE_ABILITY_DECREASE)) {
        reject()
    }
}

module.exports = {
    init,
    apply
}