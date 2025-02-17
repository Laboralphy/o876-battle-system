const CONSTS = require('../consts')

class CreatureEquipItemFailedEvent {
    constructor ({ system, creature, item, slot, cursedItem }) {
        this.type = CONSTS.EVENT_CREATURE_SELECT_WEAPON
        this.system = system
        this.creature = creature.id
        this.item = item.id
        this.slot = slot
        this.cursedItem = cursedItem
    }
}

module.exports = CreatureEquipItemFailedEvent
