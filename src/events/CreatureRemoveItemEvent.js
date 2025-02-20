const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');
const BoxedCreature = require('../sub-api/classes/BoxedCreature');
const BoxedItem = require('../sub-api/classes/BoxedItem');

class CreatureRemoveItemEvent extends GenericEvent {
    constructor ({ system, creature, item, slot }) {
        super(CONSTS.EVENT_CREATURE_REMOVE_ITEM, system);
        this.creature = new BoxedCreature(creature);
        this.item = new BoxedItem(item);
        this.slot = slot;
    }
}

module.exports = CreatureRemoveItemEvent;
