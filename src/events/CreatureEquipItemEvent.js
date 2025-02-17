const CONSTS = require('../consts')

class CreatureEquipItemEvent {
    constructor ({ system, creature, item, slot }) {
        this.type = CONSTS.EVENT_CREATURE_SELECT_WEAPON
        this.system = system
        this.creature = creature.id
        this.item = item.id
        this.slot = slot
    }
}

module.exports = CreatureEquipItemEvent
