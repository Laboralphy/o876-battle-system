const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');
const BoxedCreature = require('../sub-api/classes/BoxedCreature');

class CreatureSelectWeaponEvent extends GenericEvent {
    constructor ({ system, creature }) {
        super(CONSTS.EVENT_CREATURE_SELECT_WEAPON, system);
        this.creature = this.boxCreature(creature);
        const w = creature.getters.getSelectedWeapon;
        this.weapon = w
            ? this.boxItem(creature.getters.getSelectedWeapon)
            : null;
    }
}

module.exports = CreatureSelectWeaponEvent;
