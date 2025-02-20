const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');
const BoxedCreature = require('../sub-api/classes/BoxedCreature');

class CombatActionEvent extends GenericEvent {
    constructor ({ system, combat }) {
        super(CONSTS.EVENT_COMBAT_ACTION, system);
        this.attacker = new BoxedCreature(combat.attacker);
        this.target = new BoxedCreature(combat.target);
        this.action = combat.currentAction.id;
    }
}

module.exports = CombatActionEvent;
