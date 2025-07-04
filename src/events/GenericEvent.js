const {checkEntityCreature, checkEntityItem} = require('../check-entity');

/**
 * The parent of al events
 * @class
 */
class GenericEvent {
    constructor (sType, system) {
        /**
         * Type of event
         * @type {string}
         */
        this.type = sType;
        /**
         * The controlling instance that can be used by event handler to interact back with the entities that
         * notify their event
         */
        this.system = system;
    }

    validateCreature (oEntity) {
        return checkEntityCreature(oEntity);
    }

    validateItem (oEntity) {
        return checkEntityItem(oEntity);
    }
}

module.exports = GenericEvent;
