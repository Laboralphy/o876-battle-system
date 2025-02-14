const { checkConst } = require('../libs/check-const')
const CONSTS = require('../consts')

/**
 * Only act when attacking with weapon or natural weapon : damages dealt will heal attacker
 * @param property {RBSProperty}
 * @param damageType {string} DAMAGE_TYPE_*
 */
function init ({ property, damageType }) {
    property.data.damageType = checkConst(damageType)
}

function attack ({ property, attack, manager }) {
    const { hit, damages: { types: damageTypes }, attacker } = attack
    const sDamageType = property.data.damageType
    if (hit &&
        (attacker.hitPoints < attacker.getters.getMaxHitPoints) &&
        (sDamageType in damageTypes)
    ) {
        const amount = Math.ceil(damageTypes[sDamageType].amount * property.amp)
        const eHeal = manager.createEffect(CONSTS.EFFECT_HEAL, amount)
        manager.applyEffect(eHeal, attacker)
    }
}

module.exports = {
    init,
    attack
}
