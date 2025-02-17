const CONSTS = require('../consts')

class CombatActionEvent {
    constructor ({ system, combat }) {
        this.type = CONSTS.EVENT_COMBAT_ACTION
        this.system = system
        this.attacker = combat.attacker.id
        this.target = combat.target.id
        this.action = combat.currentAction.id
    }
}

module.exports = CombatActionEvent
