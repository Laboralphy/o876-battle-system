const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');
const BoxedCreature = require('../sub-api/classes/BoxedCreature');
const BoxedItem = require('../sub-api/classes/BoxedItem');

class CreatureLevelUpEvent extends GenericEvent {
    /**
     *
     * @param system {*}
     * @param creature {Creature}
     * @param feats {string[]}
     * @param abilityPoints {number}
     */
    constructor ({ system, creature, feats = [], abilityPoints = 0 }) {
        super(CONSTS.EVENT_CREATURE_LEVEL_UP, system);
        this.creature = this.boxCreature(creature);
        this.feats = feats;
        this.abilityPoints = abilityPoints;
        this.level = creature.getters.getUnmodifiedLevel;
    }
}

module.exports = CreatureLevelUpEvent;
