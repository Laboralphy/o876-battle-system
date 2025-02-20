const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');
const BoxedCreature = require('../sub-api/classes/BoxedCreature');

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
        this.creature = this.boxCreature(creature);
        this.source = this.boxCreature(source);
        this.amount = amount;
        this.resisted = resisted;
        this.damageType = damageType;
    }
}

module.exports = CreatureDamagedEvent;
