const CONSTS = require('../consts')

/**
 *
 * @param target {Creature}
 * @param source {Creature}
 */
function mutate ({ target, source }) {
    // will drop hp to 0
    target.hitPoints = 0
    target.events.emit('death', {
        creature: target,
        killer: source
    })
}

/**
 * Effect is rejected if target is immune to instant death
 * @param effect {RBSEffect}
 * @param target {Creature}
 * @param reject {function}
 */
function apply ({ effect, target, reject }) {
    if (target.getters.getImmunitySet.has(CONSTS.IMMUNITY_TYPE_DEATH)) {
        reject()
    }
}

module.exports = {
    mutate,
    apply
}