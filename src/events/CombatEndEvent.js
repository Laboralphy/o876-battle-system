const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');
const BoxedCreature = require('../sub-api/classes/BoxedCreature');

class CombatEndEvent extends GenericEvent {
    constructor ({ system, combat }) {
        super(CONSTS.EVENT_COMBAT_END, system);
        this.attacker = new BoxedCreature(combat.attacker);
        this.target = new BoxedCreature(combat.target);
    }
}

module.exports = CombatEndEvent;
