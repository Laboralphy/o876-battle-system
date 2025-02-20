const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');
const BoxedEffect = require('../sub-api/classes/BoxedEffect');
const BoxedCreature = require('../sub-api/classes/BoxedCreature');

class CreatureEffectAppliedEvent extends GenericEvent {
    constructor ({ system, effect }) {
        super(CONSTS.EVENT_CREATURE_EFFECT_APPLIED, system);
        this.creature = new BoxedCreature(effect.target);
        this.effect = new BoxedEffect(effect);
    }
}

module.exports = CreatureEffectAppliedEvent;
