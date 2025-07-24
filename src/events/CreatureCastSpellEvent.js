const GenericEvent = require('./GenericEvent');
const CONSTS = require('../consts');

class CreatureCastSpellEvent extends GenericEvent {
    constructor ({ system, creature, target = null, action }) {
        super(CONSTS.EVENT_CREATURE_CAST_SPELL, system);
        this.creature = this.validateCreature(creature);
        this.target = target ? this.validateCreature(target) : null;
        this.spell = action.parameters.spell.id;
        this.freeCast = action.parameters.freeCast;
    }
}

module.exports = CreatureCastSpellEvent;
