const CONSTS = require('../consts')

function init ({ effect }) {
    this.data.lastCheck = 0
}

/**
 * @param effect
 * @param target
 * @param attackOutcome
 */
function attack ({ effect, attackOutcome }) {
    attackOutcome.attacker.mutations.removeEffect({ effect })
}

/**
 * Each time : do a roll Skill, it will be used as a difficulty class for any skill-investigation
 * @param effect
 */
function mutate ({ effect }) {

}

function apply ({ target, reject }) {
    if (target.getters.getters.getEffectSet.has(CONSTS.EFFECT_STEALTH)) {
        reject()
    }
}

module.exports = {
    init,
    attack,
    mutate,
    apply
}
