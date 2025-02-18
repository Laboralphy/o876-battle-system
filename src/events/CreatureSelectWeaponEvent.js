const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');

class CreatureSelectWeaponEvent extends GenericEvent {
    constructor ({ system, creature }) {
        super(CONSTS.EVENT_CREATURE_SELECT_WEAPON, system);
        this.creature = this.boxCreature(creature);
    }
}

module.exports = CreatureSelectWeaponEvent;
