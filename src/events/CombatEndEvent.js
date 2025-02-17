const CONSTS = require('../consts')

class CombatEndEvent {
    constructor ({ system, combat }) {
        this.type = CONSTS.EVENT_COMBAT_END
        this.system = system
        this.attacker = combat.attacker.id
        this.target = combat.target.id
    }
}

module.exports = CombatEndEvent
