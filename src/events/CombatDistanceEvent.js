const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');

class CombatDistanceEvent extends GenericEvent {
    constructor ({ system, combat }) {
        super(CONSTS.EVENT_COMBAT_DISTANCE, system);
        this.attacker = this.validateCreature(combat.attacker);
        this.target = this.validateCreature(combat.target);
        this.distance = combat.distance;
    }
}

module.exports = CombatDistanceEvent;
