const CONSTS = require('../consts')
const {checkConst} = require("../libs/check-const");

/**
 * Inflict damage
 * @param effect {RBSEffect}
 * @param value {number}
 * @param sDamageType {string} DAMAGE_TYPE_
 * @param critical {boolean}
 */
function init ({ effect, damageType: sDamageType, critical = false }) {
    checkConst(sDamageType)
    if (effect.amp === 0 && sDamageType === CONSTS.DAMAGE_TYPE_POISON) {
        throw new Error('WTF!!! POISON 0 amp')
    }
    Object.assign(effect.data, {
        damageType: sDamageType,
        appliedAmount: 0,
        resistedAmount: 0,
        critical
    })
}

/**
 * @param damageType {string}
 * @param material {string[]}
 * @param source {Creature}
 * @param amp {string|number}
 * @returns {{amount: number, resisted: number}}
 */
function rollDamageAmount ({ damageType, material, amp, target }) {
    // What is the damage resistance, vulnerability, reduction ?
    const oMitigation = target.getters.getDamageMitigation
    const sType = damageType
    const aMaterials = material
    let bMaterialVulnerable = false
    if (aMaterials) {
        bMaterialVulnerable = aMaterials.some(m => oMitigation[m] && oMitigation[m].vulnerability)
    }
    amp = typeof amp === 'number'
        ? amp
        : target.dice.roll(amp)
    if (sType in oMitigation) {
        const { factor, reduction } = oMitigation[sType]
        const nFinalFactor = bMaterialVulnerable ? Math.max(1, 2 * factor) : factor
        const nModifiedAmount = Math.ceil(Math.max(0, (amp - reduction)) * nFinalFactor)
        const nResistedAmount = Math.max(0, amp - nModifiedAmount)
        return {
            amount: nModifiedAmount,
            resisted: nResistedAmount
        }
    } else {
        // no resistance no absorb no immunity
        return {
            amount: amp,
            resisted: 0
        }
    }
}

/**
 * Apply effect modification on effect target
 * @param effect {RBSEffect}
 * @param target {Creature}
 * @param source {Creature}
 */
function mutate ({ effect, target, source }) {
    const ed = effect.data
    const oRecentDamage = rollDamageAmount({
        damageType: ed.damageType,
        material: ed.material,
        amp: effect.amp,
        target
    })
    ed.appliedAmount = oRecentDamage.amount
    ed.resistedAmount = oRecentDamage.resisted
    target.hitPoints -= oRecentDamage.amount
    target.events.emit(CONSTS.EVENT_CREATURE_DAMAGED, {
        ...oRecentDamage,
        damageType: ed.damageType,
        source,
        subtype: effect.subtype
    })
    if (target.getters.isDead) {
        target.events.emit(CONSTS.EVENT_CREATURE_DEATH, {
            creature: target,
            killer: source
        })
    }
}

module.exports = {
    init,
    mutate
}