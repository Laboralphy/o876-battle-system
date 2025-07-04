const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');

class CombatEndEvent extends GenericEvent {
    constructor ({ system, combat }) {
        super(CONSTS.EVENT_COMBAT_END, system);
        this.attacker = this.validateCreature(combat.attacker);
        this.target = this.validateCreature(combat.target);
    }
}

module.exports = CombatEndEvent;
