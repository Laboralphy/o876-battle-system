const CONSTS = require('../consts')
const { onAttacked } = require('../libs/spike-damage-logic')

function init ({ property, damageType: sDamageType = CONSTS.DAMAGE_TYPE_SLASHING, maxDistance = Infinity, savingThrow = false }) {
    property.data.damageType = sDamageType
    property.data.savingThrow = savingThrow
    property.data.maxDistance = maxDistance
}

function attacked ({ effect: { amp, data }, attackOutcome }) {
    const effectProcessor = attackOutcome.effectProcessor
    onAttacked(effectProcessor, attackOutcome, amp, data)
}

module.exports = {
    init,
    attacked
}