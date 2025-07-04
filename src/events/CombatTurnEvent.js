const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');

class CombatTurnEvent extends GenericEvent {
    constructor ({ system, combat }) {
        super(CONSTS.EVENT_COMBAT_TURN, system);
        this.attacker = this.validateCreature(combat.attacker);
        this.target = this.validateCreature(combat.target);
        this.turn = combat.turn;
    }
}

module.exports = CombatTurnEvent;
