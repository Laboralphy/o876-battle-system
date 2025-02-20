const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');
const BoxedCreature = require('../sub-api/classes/BoxedCreature');

class CreatureEffectImmunityEvent extends GenericEvent {
    constructor ({ system, effect, target }) {
        super(CONSTS.EVENT_CREATURE_EFFECT_IMMUNITY, system);
        this.creature = this.boxCreature(target);
        this.effect = effect;
    }
}

module.exports = CreatureEffectImmunityEvent;
