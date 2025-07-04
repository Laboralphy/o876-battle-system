const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');

class CreatureRemoveItemEvent extends GenericEvent {
    constructor ({ system, creature, item, slot }) {
        super(CONSTS.EVENT_CREATURE_REMOVE_ITEM, system);
        this.creature = this.validateCreature(creature);
        this.item = this.validateItem(item);
        this.slot = slot;
    }
}

module.exports = CreatureRemoveItemEvent;
