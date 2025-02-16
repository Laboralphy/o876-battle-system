const CONSTS = require('../consts')

class CombatTurnEvent {
    constructor ({ system, combat, speed, previousDistance, distance }) {
        this.type = CONSTS.EVENT_COMBAT_START
        this.system = system
        this.speed = speed
        this.attacker = combat.attacker.id
        this.target = combat.target.id
        this.distance = distance
        this.previousDistance = previousDistance
    }
}

module.exports = CombatTurnEvent
