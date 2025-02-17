const CONSTS = require('../consts')

class CombatDistanceEvent {
    constructor ({ system, combat }) {
        this.type = CONSTS.EVENT_COMBAT_DISTANCE
        this.system = system
        this.attacker = combat.attacker.id
        this.target = combat.target.id
        this.distance = combat.distance
    }
}

module.exports = CombatDistanceEvent
