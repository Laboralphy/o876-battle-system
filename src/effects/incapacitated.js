const CONSTS = require('../consts');

/**
 *
 * @param effect {RBSEffect}
 * @param effectProcessor {EffectProcessor}
 * @param target {Creature}
 */
function mutate ({ effectProcessor, target }) {
    // remove all concentration effect
    const eConcentration = target.getters.getEffects.find(eff => eff.type === CONSTS.EFFECT_CONCENTRATION);
    if (eConcentration) {
        effectProcessor.removeEffect(eConcentration);
    }
}

/**
 * This effect forces creature to be incapacitated : can't do anything
 * @type {{}}
 */
module.exports = {
    mutate
};
