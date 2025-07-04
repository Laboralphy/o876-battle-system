const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');

class CombatActionEvent extends GenericEvent {
    constructor ({ system, combat, action }) {
        super(CONSTS.EVENT_COMBAT_ACTION, system);
        this.attacker = this.validateCreature(combat.attacker);
        this.target = this.validateCreature(combat.target);
        this.action = action;
    }
}

module.exports = CombatActionEvent;
