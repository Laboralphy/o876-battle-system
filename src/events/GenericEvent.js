const BoxedCreature = require('../sub-api/classes/BoxedCreature');
const BoxedItem = require('../sub-api/classes/BoxedItem');
const Creature = require('../Creature');
const CONSTS = require('../consts');
const {checkEntityCreature, checkEntityItem} = require('../check-entity');

/**
 * The parent of al events
 * @class
 */
class GenericEvent {
    static _useObjectBoxing = false;

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

    /**
     * According to property useBoxedObjects, returns boxed version of specified creature or creature identifier
     * @param oCreature {Creature}
     * @returns {BoxedCreature|Creature}
     */
    boxCreature (oCreature) {
        if (oCreature === undefined) {
            throw new ReferenceError('Undefined creature');
        }
        if (oCreature === null) {
            return null;
        }
        return GenericEvent.useObjectBoxing ? new BoxedCreature(oCreature) : oCreature;
    }

    /**
     * According to property useBoxedObjects, returns boxed version of specified item or item identifier
     * @param oItem {RBSItem}
     * @returns {BoxedItem|RBSItem}
     */
    boxItem (oItem) {
        if (oItem === null) {
            return null;
        }
        return GenericEvent.useObjectBoxing ? new BoxedItem(oItem) : oItem;
    }

    /**
     * Returns true if Events must box entities
     * If true, then boxCreature() and boxItem() will return BoxObject instead of string identifier
     * @returns {boolean}
     */
    static get useObjectBoxing () {
        return this._useObjectBoxing;
    }

    /**
     * Turns the use of BoxedObject on or off.
     * @param value {boolean}
     */
    static set useObjectBoxing (value) {
        this._useObjectBoxing = value;
    }
}

module.exports = GenericEvent;
