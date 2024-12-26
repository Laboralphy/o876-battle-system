const CONSTS = require('../consts')

/**
 * When success saving throw against paralysis the effect ends
 * @param effect
 * @param target
 */
function mutate ({ effect, target }) {
    if (target.rollSavingThrow(CONSTS.SAVING_THROW_PARALYSIS_PETRIFY, { ability: CONSTS.ABILITY_STRENGTH })) {
        target.mutations.removeEffect({ effect })
    }
}

/**
 * Effect is rejected if target is immune to paralysis
 * @param effect {RBSEffect}
 * @param target {Creature}
 * @param reject {function}
 */
function apply ({ effect, target, reject }) {
    if (target.getters.getImmunitySet.has(CONSTS.IMMUNITY_TYPE_PARALYSIS)) {
        reject()
    }
}

module.exports = {
    mutate,
    apply
}