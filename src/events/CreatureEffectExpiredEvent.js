const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');
const BoxedEffect = require('../sub-api/classes/BoxedEffect');
const BoxedCreature = require('../sub-api/classes/BoxedCreature');

class CreatureEffectExpiredEvent extends GenericEvent {
    constructor ({ system, effect }) {
        super(CONSTS.EVENT_CREATURE_EFFECT_EXPIRED, system);
        this.creature = new BoxedCreature(effect.target);
        this.effect = new BoxedEffect(effect);
        this.effect.free();
    }
}

module.exports = CreatureEffectExpiredEvent;
