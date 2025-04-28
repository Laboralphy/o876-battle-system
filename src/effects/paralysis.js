const CONSTS = require('../consts');

function init ({ effect, dc = 0 }) {
    effect.data.dc = dc;
}

/**
 * Each time will try to break free
 * @param effect
 * @param effectProcessor {EffectProcessor}
 * @param target
 */
function mutate ({ effect, effectProcessor, target }) {
    if (effect.data.dc > 0) {
        if (target.rollSavingThrow(
            CONSTS.ABILITY_STRENGTH,
            effect.data.dc,
            CONSTS.THREAT_TYPE_PARALYSIS
        ).success) {
            effectProcessor.removeEffect(effect);
        }
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
        reject();
    }
}

module.exports = {
    apply,
    mutate,
    init
};
