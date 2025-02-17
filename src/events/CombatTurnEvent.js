const CONSTS = require('../consts')

class CombatTurnEvent {
    constructor ({ system, combat }) {
        this.type = CONSTS.EVENT_COMBAT_TURN
        this.system = system
        this.attacker = combat.attacker.id
        this.target = combat.target.id
        this.turn = combat.turn
    }
}

module.exports = CombatTurnEvent
