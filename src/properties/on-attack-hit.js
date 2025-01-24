const CONSTS = require('../consts')

/**
 * This property will be applied an effect on anybody hit by attack
 * @param property {RBSProperty}
 * @param savingThrow {string} ability
 * @param extraParams {object}
 * @param ailment {string}
 */
function init ({ property, ailment, savingThrow = '', ...extraParams }) {
    if (!CONSTS[ailment]) {
        throw new ReferenceError('unknown ailment ' + ailment)
    }
    property.data.ailment = ailment
    property.data.savingThrow = savingThrow
    property.data.extraParams = extraParams
}

/**
 *
 * @param property {RBSProperty}
 * @param oTarget {Creature}
 * @param oSource {Creature}
 * @param oEffectProcessor {EffectProcessor}
 * @return {RBSEffect|RBSEffect[]}
 * @private
 */
function _createAilmentEffect (property, oTarget, oSource, oEffectProcessor) {
    const {
        amp,
        data: {
            ailment,
            extraParams: {
                subtype = CONSTS.EFFECT_SUBTYPE_MAGICAL,
                duration = Infinity,
                ...extraParams
            }
        }
    } = property
    let oEffect
    const nAmp = oSource.dice.roll(amp)
    switch (ailment) {
        case CONSTS.ON_ATTACK_HIT_ABILITY_DRAIN: {
            const { ability } = extraParams
            oEffect = oEffectProcessor.createEffect(CONSTS.EFFECT_ABILITY_MODIFIER, nAmp, { ability })
            break
        }
        case CONSTS.ON_ATTACK_HIT_ATTACK_DRAIN: {
            const { attackType = undefined } = extraParams
            oEffect = oEffectProcessor.createEffect(CONSTS.EFFECT_ATTACK_MODIFIER, nAmp, { attackType })
            break
        }
        case CONSTS.ON_ATTACK_HIT_ARMOR_CLASS_DRAIN: {
            const { damageType = undefined, attackType = undefined } = extraParams
            oEffect = oEffectProcessor.createEffect(CONSTS.EFFECT_ARMOR_CLASS_MODIFIER, nAmp, { damageType, attackType })
            break
        }
        case CONSTS.ON_ATTACK_HIT_BLINDNESS: {
            oEffect = oEffectProcessor.createEffect(CONSTS.EFFECT_BLINDNESS)
            break
        }
        case CONSTS.ON_ATTACK_HIT_CONFUSION: {
            oEffect = oEffectProcessor.createEffect(CONSTS.EFFECT_CONFUSION)
            break
        }
        case CONSTS.ON_ATTACK_HIT_DISEASE: {
            const { disease } = extraParams
            const { stages } = oSource.data.DISEASES[disease]
            oEffect = oEffectProcessor.createEffect(CONSTS.EFFECT_DISEASE, nAmp, {
                disease,
                stages
            })
            break
        }
        case CONSTS.ON_ATTACK_HIT_FEAR: {
            oEffect = oEffectProcessor.createEffect(CONSTS.EFFECT_FEAR)
            break
        }
        case CONSTS.ON_ATTACK_HIT_LEVEL_DRAIN: {
            oEffect = oEffectProcessor.createEffect(CONSTS.EFFECT_NEGATIVE_LEVEL, nAmp)
            break
        }
        case CONSTS.ON_ATTACK_HIT_POISON: {
            oEffect = oEffectProcessor.createEffect(CONSTS.EFFECT_DAMAGE, amp, { damageType: CONSTS.DAMAGE_TYPE_POISON })
            break
        }
        case CONSTS.ON_ATTACK_HIT_PARALYSIS: {
            oEffect = oEffectProcessor.createEffect(CONSTS.EFFECT_PARALYSIS)
            break
        }
        case CONSTS.ON_ATTACK_HIT_PETRIFICATION: {
            oEffect = oEffectProcessor.createEffect(CONSTS.EFFECT_PETRIFICATION)
            break
        }
        case CONSTS.ON_ATTACK_HIT_SLOW: {
            const oEffectSF = oEffectProcessor.createEffect(CONSTS.EFFECT_SPEED_FACTOR, 0.5)
            const oEffectAC = oEffectProcessor.createEffect(CONSTS.EFFECT_ATTACK_COUNT_MODIFIER, 0.5)
            oEffect = [oEffectSF, oEffectAC]
            break
        }
        case CONSTS.ON_ATTACK_HIT_STUN: {
            oEffect = oEffectProcessor.createEffect(CONSTS.EFFECT_STUN)
            break
        }
        default: {
            throw new Error(`on attack hit : unknown ailment : ${ailment}`)
        }
    }
    if (Array.isArray(oEffect)) {
        oEffect.forEach(e => {
            e.subtype = subtype
        })
        oEffectProcessor.applyEffectGroup(oEffect, '', oTarget, duration, oSource)
    } else {
        oEffect.subtype = subtype
        oEffectProcessor.applyEffect(oEffect, oTarget, duration, oSource)
    }
    return oEffect
}

/**
 *
 * @param property {RBSProperty}
 * @param item {RBSItem}
 * @param creature {Creature}
 * @param manager {Manager}
 * @param attack {AttackOutcome}
 */
function attack ({ property, item, manager, attack }) {
    const sDefensiveAbility = property.data.savingThrow
    const attacker = attack.attacker
    const target = attack.target
    if (sDefensiveAbility) {
        const sOffensiveAbility = attack.ability
        const dc = attacker.getters.getSpellDifficultyClass[sOffensiveAbility]
        const { success } = target.rollSavingThrow(sDefensiveAbility, dc)
        if (success) {
            return
        }
    }
    _createAilmentEffect(property, target, attacker, manager.effectProcessor)
}

module.exports = {
    init,
    attack
}
