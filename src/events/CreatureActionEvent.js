const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');

class CreatureActionEvent extends GenericEvent {
    constructor ({ system, creature, target = null, action }) {
        super(CONSTS.EVENT_CREATURE_ACTION, system);
        this.creature = this.boxCreature(creature);
        this.target = target ? this.boxCreature(target) : null;
        this.action = action;
    }
}

module.exports = CreatureActionEvent;
