const CONSTS = require('../consts')
const BoxedEffect = require("../sub-api/classes/BoxedEffect");

class CreatureEffectImmunityEvent {
    constructor ({ system, effect }) {
        this.type = CONSTS.EVENT_CREATURE_EFFECT_IMMUNITY
        this.system = system
        this.creature = effect.target
        this.effect = new BoxedEffect(effect)
    }
}

module.exports = CreatureEffectImmunityEvent
