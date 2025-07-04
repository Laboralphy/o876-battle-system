const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');

class CreatureEffectExpiredEvent extends GenericEvent {
    constructor ({ system, effect, target }) {
        super(CONSTS.EVENT_CREATURE_EFFECT_EXPIRED, system);
        this.creature = this.validateCreature(target);
        this.effect = effect;
    }
}

module.exports = CreatureEffectExpiredEvent;
