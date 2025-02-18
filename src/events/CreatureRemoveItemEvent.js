const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');

class CreatureRemoveItemEvent extends GenericEvent {
    constructor ({ system, creature, item, slot }) {
        super(CONSTS.EVENT_CREATURE_REMOVE_ITEM, system);
        this.creature = this.boxCreature(creature);
        this.item = this.boxItem(item);
        this.slot = slot;
    }
}

module.exports = CreatureRemoveItemEvent;
