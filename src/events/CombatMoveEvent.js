const CONSTS = require('../consts')

class CombatMoveEvent {
    constructor ({ system, combat, speed }) {
        this.type = CONSTS.EVENT_COMBAT_MOVE
        this.system = system
        this.speed = speed
        this.attacker = combat.attacker.id
        this.target = combat.target.id
        this.distance = combat.distance
    }
}

module.exports = CombatMoveEvent
