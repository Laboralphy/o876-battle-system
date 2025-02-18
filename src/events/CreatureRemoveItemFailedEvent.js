const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');

class CreatureRemoveItemFailedEvent extends GenericEvent {
    constructor ({ system, creature, item, slot, cursedItem }) {
        super(CONSTS.EVENT_CREATURE_REMOVE_ITEM_FAILED, system);
        this.creature = this.boxCreature(creature);
        this.item = this.boxItem(item);
        this.slot = slot;
        this.cursedItem = cursedItem;
    }
}

module.exports = CreatureRemoveItemFailedEvent;
