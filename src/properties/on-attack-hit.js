const CONSTS = require('../consts')

case BASE_AILMENT_DURATION = 3

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

function _createAilmentEffect (property, oSource, oEffectProcessor) {
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
            oEffect.subtype = subtype
            // Ici revoir les tags des effect : se servir des tags pour la stackabilité
            // stack rules : replace, prevent, update(amp, duration)
            break
        }
        case CONSTS.ON_ATTACK_HIT_ATTACK_DRAIN: {
            break
        }
        case CONSTS.ON_ATTACK_HIT_ARMOR_CLASS_DRAIN: {
            break
        }
        case CONSTS.ON_ATTACK_HIT_BLINDNESS: {
            break
        }
        case CONSTS.ON_ATTACK_HIT_CONFUSION: {
            break
        }
        case CONSTS.ON_ATTACK_HIT_DISEASE: {
            break
        }
        case CONSTS.ON_ATTACK_HIT_DOOM: {
            break
        }
        case CONSTS.ON_ATTACK_HIT_FEAR: {
            break
        }
        case CONSTS.ON_ATTACK_HIT_LEVEL_DRAIN: {
            break
        }
        case CONSTS.ON_ATTACK_HIT_POISON: {
            break
        }
        case CONSTS.ON_ATTACK_HIT_PARALYSIS: {
            break
        }
        case CONSTS.ON_ATTACK_HIT_PETRIFICATION: {
            break
        }
        case CONSTS.ON_ATTACK_HIT_SILENCE: {
            break
        }
        case CONSTS.ON_ATTACK_HIT_SLOW: {
            break
        }
        case CONSTS.ON_ATTACK_HIT_STUN: {
            break
        }
    }
}

/**
 *
 * @param property {RBSProperty}
 * @param item {RBSItem}
 * @param creature {Creature}
 * @param manager {Manager}
 * @param attack {AttackOutcome}
 */
function attack ({ property, item, creature, manager, attack }) {
    const sDefensiveAbility = property.data.savingThrow
    if (sDefensiveAbility) {
        const attacker = attack.attacker
        const target = attack.target
        const sOffensiveAbility = attack.ability
        const dc = attacker.getters.getSpellDifficultyClass[sOffensiveAbility]
        const { success } = target.rollSavingThrow(sDefensiveAbility, dc)
        if (!success) {
            // applying ailment
            const oAilment
        }
    }
}

module.exports = {
    init,
    attack
}