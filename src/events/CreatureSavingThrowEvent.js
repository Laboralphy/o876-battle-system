const CONSTS = require('../consts')

class CreatureSavingThrowEvent {
    constructor ({ system, creature, roll, dc, success, bonus, ability }) {
        this.type = CONSTS.EVENT_CREATURE_REVIVE
        this.system = system
        this.creature = creature.id
        this.roll = roll
        this.dc = dc
        this.success = success
        this.ability = ability
        this.bonus = bonus
    }
}

module.exports = CreatureSavingThrowEvent
