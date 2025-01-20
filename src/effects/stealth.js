const CONSTS = require('../consts')

function init ({ effect }) {
    this.data.lastCheck = 0
}

/**
 * @param effect
 * @param effectProcessor {EffectProcessor}
 * @param target
 * @param attackOutcome {AttackOutcome}
 */
function attack ({ effect, effectProcessor, attackOutcome }) {
    effectProcessor.removeEffect(effect)
}

function apply ({ target, reject }) {
    if (target.getters.getters.getEffectSet.has(CONSTS.EFFECT_STEALTH)) {
        reject()
    }
}

module.exports = {
    init,
    attack,
    apply
}
