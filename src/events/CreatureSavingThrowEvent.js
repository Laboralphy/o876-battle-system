const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');
const BoxedCreature = require('../sub-api/classes/BoxedCreature');

class CreatureSavingThrowEvent extends GenericEvent {
    constructor ({ system, creature, roll, dc, success, bonus, ability }) {
        super(CONSTS.EVENT_CREATURE_SAVING_THROW, system);
        this.creature = this.boxCreature(creature);
        this.roll = roll;
        this.dc = dc;
        this.success = success;
        this.ability = ability;
        this.bonus = bonus;
    }
}

module.exports = CreatureSavingThrowEvent;
