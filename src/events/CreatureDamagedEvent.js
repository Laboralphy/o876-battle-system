const CONSTS = require('../consts')

class CreatureDamagedEvent {
    /**
     *
     * @param system {*}
     * @param creature {Creature}
     * @param source {Creature}
     * @param amount {number}
     * @param resisted {number}
     * @param damageType {string}
     */
    constructor ({ system, creature, source, amount, resisted, damageType }) {
        this.type = CONSTS.EVENT_CREATURE_DAMAGED
        this.system = system
        this.creature = creature.id
        this.source = source.id
        this.amount = amount
        this.resisted = resisted
        this.damageType = damageType
    }
}

module.exports = CreatureDamagedEvent
