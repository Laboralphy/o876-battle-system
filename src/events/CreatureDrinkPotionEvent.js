const GenericEvent = require('./GenericEvent');
const CONSTS = require('../consts');

class CreatureDrinkPotionEvent extends GenericEvent {
    constructor ({ system, creature, target = null, action }) {
        super(CONSTS.EVENT_CREATURE_DRINK_POTION, system);
        this.creature = this.validateCreature(creature);
        this.target = target ? this.validateCreature(target) : null;
        this.spell = action.parameters.spell.id;
    }
}

module.exports = CreatureDrinkPotionEvent;
