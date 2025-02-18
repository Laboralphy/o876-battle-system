const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');

class CombatEndEvent extends GenericEvent {
    constructor ({ system, combat }) {
        super(CONSTS.EVENT_COMBAT_END, system);
        this.attacker = this.boxCreature(combat.attacker);
        this.target = this.boxCreature(combat.target.id);
    }
}

module.exports = CombatEndEvent;
