const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');
const BoxedEffect = require('../sub-api/classes/BoxedEffect');

class CreatureEffectExpiredEvent extends GenericEvent {
    constructor ({ system, effect }) {
        super(CONSTS.EVENT_CREATURE_EFFECT_EXPIRED, system);
        this.creature = this.boxCreature(effect.target);
        this.effect = this.boxEffect(effect);
    }
}

module.exports = CreatureEffectExpiredEvent;
