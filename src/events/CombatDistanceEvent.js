const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');
const BoxedCreature = require('../sub-api/classes/BoxedCreature');

class CombatDistanceEvent extends GenericEvent {
    constructor ({ system, combat }) {
        super(CONSTS.EVENT_COMBAT_DISTANCE, system);
        this.attacker = this.boxCreature(combat.attacker);
        this.target = this.boxCreature(combat.target);
        this.distance = combat.distance;
    }
}

module.exports = CombatDistanceEvent;
