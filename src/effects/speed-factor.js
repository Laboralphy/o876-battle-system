const CONSTS = require('../consts')

/**
 * Effect is rejected if amp is in ]0..1[ and target is immune to slow
 * Effect is rejected if amp is 0 and target is immune to root
 * @param effect {RBSEffect}
 * @param target {Creature}
 * @param reject {function}
 */
function apply ({ effect, target, reject }) {
    const aImmSet = target.getters.getImmunitySet
    if (effect.amp > 0 && effect.amp < 1 && aImmSet.has(CONSTS.IMMUNITY_TYPE_SLOW)) {
        reject()
    }
    if (effect.amp === 0 && aImmSet.has(CONSTS.IMMUNITY_TYPE_ROOT)) {
        reject()
    }
}

module.exports = {
    apply
}