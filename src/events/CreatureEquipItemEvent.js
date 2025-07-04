const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');

class CreatureEquipItemEvent extends GenericEvent {
    constructor ({ system, creature, item, slot }) {
        super(CONSTS.EVENT_CREATURE_EQUIP_ITEM, system);
        this.creature = this.validateCreature(creature);
        this.item = this.validateItem(item);
        this.slot = slot;
    }
}

module.exports = CreatureEquipItemEvent;
