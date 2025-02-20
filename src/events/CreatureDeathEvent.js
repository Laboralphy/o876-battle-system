const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');
const BoxedCreature = require('../sub-api/classes/BoxedCreature');

class CreatureDeathEvent extends GenericEvent {
    constructor ({ system, creature, killer }) {
        super(CONSTS.EVENT_CREATURE_DEATH, system);
        this.creature = this.boxCreature(creature);
        this.killer = this.boxCreature(killer);
    }
}

module.exports = CreatureDeathEvent;
