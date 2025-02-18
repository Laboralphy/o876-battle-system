const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');

class CombatTurnEvent extends GenericEvent {
    constructor ({ system, combat }) {
        super(CONSTS.EVENT_COMBAT_TURN, system);
        this.attacker = this.boxCreature(combat.attacker);
        this.target = this.boxCreature(combat.target);
        this.turn = combat.turn;
    }
}

module.exports = CombatTurnEvent;
