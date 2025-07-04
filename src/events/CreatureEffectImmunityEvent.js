const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');

class CreatureEffectImmunityEvent extends GenericEvent {
    constructor ({ system, effect, target }) {
        super(CONSTS.EVENT_CREATURE_EFFECT_IMMUNITY, system);
        this.creature = this.validateCreature(target);
        this.effect = effect;
    }
}

module.exports = CreatureEffectImmunityEvent;
