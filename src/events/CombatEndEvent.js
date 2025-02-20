const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');
const BoxedCreature = require('../sub-api/classes/BoxedCreature');

class CombatEndEvent extends GenericEvent {
    constructor ({ system, combat }) {
        super(CONSTS.EVENT_COMBAT_END, system);
        this.attacker = this.boxCreature(combat.attacker);
        this.target = this.boxCreature(combat.target);
    }
}

module.exports = CombatEndEvent;
