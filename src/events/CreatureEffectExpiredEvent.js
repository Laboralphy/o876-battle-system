const CONSTS = require('../consts')
const BoxedEffect = require("../sub-api/classes/BoxedEffect");

class CreatureEffectExpiredEvent {
    constructor ({ system, effect }) {
        this.type = CONSTS.EVENT_CREATURE_EFFECT_EXPIRED
        this.system = system
        this.creature = effect.target
        this.effect = new BoxedEffect(effect)
    }
}

module.exports = CreatureEffectExpiredEvent
