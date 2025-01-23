const CONSTS = require('../../consts');

/**
 *
 * @param effectProcessor {EffectProcessor}
 * @param attackOutcome {AttackOutcome}
 * @param amp {number|string}
 * @param data {{}}
 */
function onAttacked (effectProcessor, attackOutcome, amp, data) {
    if (!attackOutcome.hit || attackOutcome.damages.amount <= 0 || attackOutcome.distance > data.maxDistance) {
        return
    }
    const {
        attacker,
        target,
        ability
    } = attackOutcome
    // check saving throw
    if (
        data.savingThrow &&
        attacker.rollSavingThrow(CONSTS.ABILITY_DEXTERITY, attacker.getters.getSpellDifficultyClass[ability]).success
    ) {
        return
    }
    // The attacker will take damage
    const eDamage = effectProcessor.createEffect(CONSTS.EFFECT_DAMAGE, amp, {
        damageType: data.damageType
    })
    effectProcessor.applyEffect(eDamage, attacker, 0, target)
}

module.exports = {
    onAttacked
}