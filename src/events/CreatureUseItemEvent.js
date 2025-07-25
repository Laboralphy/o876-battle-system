const GenericEvent = require('./GenericEvent');
const CONSTS = require('../consts');

class CreatureUseItemEvent extends GenericEvent {
    constructor ({ system, creature, target = null, action }) {
        super(CONSTS.EVENT_CREATURE_USE_ITEM, system);
        this.creature = this.validateCreature(creature);
        this.target = target ? this.validateCreature(target) : null;
        this.item = action.parameters.item;
        this.spell = action.parameters.spell;
    }
}

module.exports = CreatureUseItemEvent;
