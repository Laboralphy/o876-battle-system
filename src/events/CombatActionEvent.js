const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');
const BoxedCreature = require('../sub-api/classes/BoxedCreature');

class CombatActionEvent extends GenericEvent {
    constructor ({ system, combat, action }) {
        super(CONSTS.EVENT_COMBAT_ACTION, system);
        this.attacker = this.boxCreature(combat.attacker);
        this.target = this.boxCreature(combat.target);
        this.action = action;
    }
}

module.exports = CombatActionEvent;
