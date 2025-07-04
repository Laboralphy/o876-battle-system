const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');

class CreatureReviveEvent extends GenericEvent {
    constructor ({ system, creature }) {
        super(CONSTS.EVENT_CREATURE_REVIVE, system);
        this.creature = this.validateCreature(creature);
    }
}

module.exports = CreatureReviveEvent;
