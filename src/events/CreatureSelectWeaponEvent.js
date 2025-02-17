const CONSTS = require('../consts')

class CreatureSelectWeaponEvent {
    constructor ({ system, creature }) {
        this.type = CONSTS.EVENT_CREATURE_SELECT_WEAPON
        this.system = system
        this.creature = creature.id
    }
}

module.exports = CreatureSelectWeaponEvent
