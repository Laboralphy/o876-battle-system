const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');

class CreatureDeathEvent extends GenericEvent {
    constructor ({ system, creature, killer }) {
        super(CONSTS.EVENT_CREATURE_DEATH, system);
        this.creature = this.validateCreature(creature);
        this.killer = this.validateCreature(killer);
    }
}

module.exports = CreatureDeathEvent;
