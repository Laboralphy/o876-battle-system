const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');
const BoxedCreature = require('../sub-api/classes/BoxedCreature');
const BoxedItem = require('../sub-api/classes/BoxedItem');

class CreatureRemoveItemFailedEvent extends GenericEvent {
    constructor ({ system, creature, item, slot, cursedItem }) {
        super(CONSTS.EVENT_CREATURE_REMOVE_ITEM_FAILED, system);
        this.creature = new BoxedCreature(creature);
        this.item = new BoxedItem(item);
        this.slot = slot;
        this.cursedItem = cursedItem;
    }
}

module.exports = CreatureRemoveItemFailedEvent;
