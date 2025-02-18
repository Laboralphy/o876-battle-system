const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');

class CombatActionEvent extends GenericEvent {
    constructor ({ system, combat }) {
        super(CONSTS.EVENT_COMBAT_ACTION, system);
        this.attacker = this.boxCreature(combat.attacker);
        this.target = this.boxCreature(combat.target);
        this.action = combat.currentAction.id;
    }
}

module.exports = CombatActionEvent;
