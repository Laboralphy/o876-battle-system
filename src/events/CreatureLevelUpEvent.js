const CONSTS = require('../consts');
const GenericEvent = require('./GenericEvent');

class CreatureLevelUpEvent extends GenericEvent {
    /**
     *
     * @param system {*}
     * @param creature {Creature}
     * @param feats {string[]}
     * @param abilityPoints {number}
     */
    constructor ({ system, creature, feats: { added = [], removed = [] } = {}, abilityPoints = 0 }) {
        super(CONSTS.EVENT_CREATURE_LEVEL_UP, system);
        this.creature = this.boxCreature(creature);
        this.feats = {
            added,
            removed
        };
        this.abilityPoints = abilityPoints;
        this.level = creature.getters.getUnmodifiedLevel;
    }
}

module.exports = CreatureLevelUpEvent;
