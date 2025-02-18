const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');

class CombatStartEvent extends GenericEvent {
    constructor ({ system, combat }) {
        super(CONSTS.EVENT_COMBAT_START, system);
        this.attacker = this.boxCreature(combat.attacker);
        this.target = this.boxCreature(combat.target);
    }
}

module.exports = CombatStartEvent;
