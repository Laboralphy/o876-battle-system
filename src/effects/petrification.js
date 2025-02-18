const CONSTS = require('../consts');

/**
 * Effect is rejected if target is immune to petrification
 * @param effect {RBSEffect}
 * @param target {Creature}
 * @param reject {function}
 */
function apply ({ effect, target, reject }) {
    if (target.getters.getImmunitySet.has(CONSTS.IMMUNITY_TYPE_PETRIFICATION)) {
        reject();
    }
}

/**
 * Effect will end if source creature is slain
 * @param effect {RBSEffect}
 * @param effectProcessor {EffectProcessor}
 * @param target {Creature}
 * @param source {Creature}
 */
function mutate ({ effect, effectProcessor, target, source }) {
    if (source.getters.isDead) {
        effectProcessor.removeEffect(effect);
    }
}

module.exports = {
    apply,
    mutate
};
