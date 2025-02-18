const CONSTS = require('../consts')

class CreatureRemoveItemEvent {
    constructor ({ system, creature, item, slot }) {
        this.type = CONSTS.EVENT_CREATURE_REMOVE_ITEM
        this.system = system
        this.creature = creature.id
        this.item = item.id
        this.slot = slot
    }
}

module.exports = CreatureRemoveItemEvent
