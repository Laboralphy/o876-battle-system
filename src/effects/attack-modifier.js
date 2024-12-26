const CONSTS = require('../consts')
const {checkConst} = require("../libs/check-const");

function init ({ effect, attackType = CONSTS.ATTACK_TYPE_ANY } = {}) {
    effect.data.attackType = checkConst(attackType)
}

/**
 * Effect is rejected if amp is negative and target is immune to attack decrease
 * @param effect {RBSEffect}
 * @param target {Creature}
 * @param reject {function}
 */
function apply ({ effect, target, reject }) {
    if (effect.amp < 0 && target.getters.getImmunitySet.has(CONSTS.IMMUNITY_TYPE_ATTACK_DECREASE)) {
        reject()
    }
}

module.exports = {
    init,
    apply
}