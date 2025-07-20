const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');

class CreatureActionEvent extends GenericEvent {
    constructor ({ system, creature, target = null, action, parameters = {} }) {
        super(CONSTS.EVENT_CREATURE_ACTION, system);
        this.creature = this.validateCreature(creature);
        this.target = target ? this.validateCreature(target) : null;
        this.action = action;
        this.parameters = parameters;
        this._doRunScript = true;
    }

    cancelScript () {
        this._doRunScript = false;
    }

    get isScriptEnabled () {
        return this._doRunScript;
    }
}

module.exports = CreatureActionEvent;
