const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');
const BoxedCreature = require('../sub-api/classes/BoxedCreature');

class CreatureReviveEvent extends GenericEvent {
    constructor ({ system, creature }) {
        super(CONSTS.EVENT_CREATURE_REVIVE, system);
        this.creature = new BoxedCreature(creature);
    }
}

module.exports = CreatureReviveEvent;
