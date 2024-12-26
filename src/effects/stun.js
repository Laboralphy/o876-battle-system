const CONSTS = require('../consts')

/**
 * Effect is rejected if target is immune to stun
 * @param effect {RBSEffect}
 * @param target {Creature}
 * @param reject {function}
 */
function apply ({ effect, target, reject }) {
    if (target.getters.getImmunitySet.has(CONSTS.IMMUNITY_TYPE_STUN)) {
        reject()
    }
}

module.exports = {
    apply
}