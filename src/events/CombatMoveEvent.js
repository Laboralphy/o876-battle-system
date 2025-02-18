const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');

class CombatMoveEvent extends GenericEvent {
    constructor ({ system, combat, speed }) {
        super(CONSTS.EVENT_COMBAT_MOVE, system);
        this.speed = speed;
        this.attacker = this.boxCreature(combat.attacker);
        this.target = this.boxCreature(combat.target);
        this.distance = combat.distance;
    }
}

module.exports = CombatMoveEvent;
