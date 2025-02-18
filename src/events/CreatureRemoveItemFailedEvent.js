const CONSTS = require('../consts')

class CreatureRemoveItemFailedEvent {
    constructor ({ system, creature, item, slot, cursedItem }) {
        this.type = CONSTS.EVENT_CREATURE_REMOVE_ITEM_FAILED
        this.system = system
        this.creature = creature.id
        this.item = item.id
        this.slot = slot
        this.cursedItem = cursedItem
    }
}

module.exports = CreatureRemoveItemFailedEvent
