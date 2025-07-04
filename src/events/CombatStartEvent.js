const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');

class CombatStartEvent extends GenericEvent {
    constructor ({ system, combat }) {
        super(CONSTS.EVENT_COMBAT_START, system);
        this.attacker = this.validateCreature(combat.attacker);
        this.target = this.validateCreature(combat.target);
    }
}

module.exports = CombatStartEvent;
