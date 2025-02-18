const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');

class CombatDistanceEvent extends GenericEvent {
    constructor ({ system, combat }) {
        super(CONSTS.EVENT_COMBAT_DISTANCE, system);
        this.attacker = combat.attacker.id;
        this.target = combat.target.id;
        this.distance = combat.distance;
    }
}

module.exports = CombatDistanceEvent;
