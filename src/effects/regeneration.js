const CONSTS = require('../consts');

function mutate ({ property, effectProcessor, target, source }) {
    const eHeal = effectProcessor.createEffect(CONSTS.EFFECT_HEAL, property.amp);
    effectProcessor.applyEffect(eHeal, target, 0, source);
}

module.exports = {
    mutate
};
