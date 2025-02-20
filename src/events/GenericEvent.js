const BoxedCreature = require('../sub-api/classes/BoxedCreature');
const BoxedItem = require('../sub-api/classes/BoxedItem');
const BoxedEffect = require('../sub-api/classes/BoxedEffect');

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
        this.type = '';
        /**
         * The controlling instance that can be used by event handler to interact back with the entities that
         * notify their event
         */
        this.system = system;
    }

    /**
     * According to property useBoxedObjects, returns boxed version of specified creature or creature identifier
     * @param oCreature {Creature}
     * @returns {BoxedCreature|string}
     */
    boxCreature (oCreature) {
        return GenericEvent.useObjectBoxing ? new BoxedCreature(oCreature) : oCreature.id;
    }

    /**
     * According to property useBoxedObjects, returns boxed version of specified item or item identifier
     * @param oItem {RBSItem}
     * @returns {BoxedItem|string}
     */
    boxItem (oItem) {
        return GenericEvent.useObjectBoxing ? new BoxedItem(oItem) : oItem.id;
    }

    /**
     * According to property useBoxedObjects, returns boxed version of effect or effect identifier
     * @param oEffect {RBSEffect}
     * @returns {BoxedEffect|string}
     */
    boxEffect (oEffect) {
        return GenericEvent.useObjectBoxing ? new BoxedEffect(oEffect) : oEffect.id;
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
