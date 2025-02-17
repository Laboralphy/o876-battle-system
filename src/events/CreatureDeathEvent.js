const CONSTS = require('../consts')

class CreatureDeathEvent {
    constructor ({ system, creature, killer }) {
        this.type = CONSTS.EVENT_CREATURE_DEATH
        this.system = system
        this.creature = creature.id
        this.killer = killer.id
    }
}

module.exports = CreatureDeathEvent
