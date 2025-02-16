const CONSTS = require('../consts')

class CombatStartEvent {
    constructor ({ system, combat }) {
        this.type = CONSTS.EVENT_COMBAT_START
        this.system = system
        this.attacker = combat.attacker.id
        this.target = combat.target.id
        this.distance = combat.distance
    }
}

module.exports = CombatStartEvent
