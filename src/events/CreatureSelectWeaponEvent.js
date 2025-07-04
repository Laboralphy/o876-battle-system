const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');

class CreatureSelectWeaponEvent extends GenericEvent {
    constructor ({ system, creature }) {
        super(CONSTS.EVENT_CREATURE_SELECT_WEAPON, system);
        this.creature = this.validateCreature(creature);
        const w = creature.getters.getSelectedWeapon;
        this.weapon = w
            ? this.validateItem(creature.getters.getSelectedWeapon)
            : null;
    }
}

module.exports = CreatureSelectWeaponEvent;
