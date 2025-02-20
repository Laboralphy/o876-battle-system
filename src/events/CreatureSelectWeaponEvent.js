const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');
const BoxedCreature = require('../sub-api/classes/BoxedCreature');

class CreatureSelectWeaponEvent extends GenericEvent {
    constructor ({ system, creature }) {
        super(CONSTS.EVENT_CREATURE_SELECT_WEAPON, system);
        this.creature = this.boxCreature(creature);
    }
}

module.exports = CreatureSelectWeaponEvent;
