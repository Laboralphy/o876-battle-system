const CONSTS = require('../consts')

class CreatureReviveEvent {
    constructor ({ system, creature }) {
        this.type = CONSTS.EVENT_CREATURE_REVIVE
        this.system = system
        this.creature = creature.id
    }
}

module.exports = CreatureReviveEvent
