const GenericEvent = require('./GenericEvent');
const CONSTS = require('../consts');

class CreatureStartIncantationEvent extends GenericEvent {
    constructor ({ system, creature, target = null, action }) {
        super(CONSTS.EVENT_CREATURE_START_INCANTATION, system);
        this.creature = this.validateCreature(creature);
        this.target = target ? this.validateCreature(target) : null;
        this.spell = action.parameters.spell;
        this.freeCast = action.parameters.freeCast;
    }
}

module.exports = CreatureStartIncantationEvent;
