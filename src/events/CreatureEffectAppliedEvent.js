const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');

class CreatureEffectAppliedEvent extends GenericEvent {
    constructor ({ system, effect, target }) {
        super(CONSTS.EVENT_CREATURE_EFFECT_APPLIED, system);
        this.creature = this.validateCreature(target);
        this.effect = effect;
    }
}

module.exports = CreatureEffectAppliedEvent;
