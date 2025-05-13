const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');
const BoxedCreature = require('../sub-api/classes/BoxedCreature');
const BoxedItem = require('../sub-api/classes/BoxedItem');

class CreatureLevelUpEvent extends GenericEvent {
    constructor ({ system, creature }) {
        super(CONSTS.EVENT_CREATURE_LEVEL_UP, system);
        this.creature = this.boxCreature(creature);
    }
}

module.exports = CreatureLevelUpEvent;
