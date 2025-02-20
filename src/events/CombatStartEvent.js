const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');
const BoxedCreature = require('../sub-api/classes/BoxedCreature');

class CombatStartEvent extends GenericEvent {
    constructor ({ system, combat }) {
        super(CONSTS.EVENT_COMBAT_START, system);
        this.attacker = new BoxedCreature(combat.attacker);
        this.target = new BoxedCreature(combat.target);
    }
}

module.exports = CombatStartEvent;
