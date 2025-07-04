const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');

class CreatureDamagedEvent extends GenericEvent {
    /**
     *
     * @param system {*}
     * @param creature {Creature}
     * @param source {Creature}
     * @param amount {number}
     * @param resisted {number}
     * @param damageType {string}
     */
    constructor ({ system, creature, source, amount, resisted, damageType }) {
        super(CONSTS.EVENT_CREATURE_DAMAGED, system);
        this.creature = this.validateCreature(creature);
        this.source = this.validateCreature(source);
        this.amount = amount;
        this.resisted = resisted;
        this.damageType = damageType;
    }
}

module.exports = CreatureDamagedEvent;
