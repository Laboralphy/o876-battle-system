const CONSTS = require('../consts')

class CombatMoveEvent {
    constructor ({ system, combat, speed, previousDistance, distance }) {
        this.type = CONSTS.EVENT_COMBAT_START
        this.system = system
        this.speed = speed
        this.attacker = combat.attacker.id
        this.target = combat.target.id
        this._distance = distance
        this.previousDistance = previousDistance
    }

    distance (nDistance) {
        this._distance = nDistance
    }
}

module.exports = CombatMoveEvent
