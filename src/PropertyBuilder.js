const PROPERTIES = require('./properties')

class PropertyBuilder {

    constructor () {
        this._propertyPrograms = PROPERTIES
    }

    /**
     * Invoke effect method
     * @param oProperty {RBSProperty}
     * @param sMethod
     * @param oItem {RBSItem | null} item if property is extrinsect or null if property is intrinsect
     * @param oCreature {Creature|null} creature using item
     * @param oParams {object}
     * @returns {undefined|*}
     */
    invokePropertyMethod (oProperty, sMethod, oItem, oCreature, oParams = {}) {
        const pe = this._propertyPrograms[oProperty.type]
        if (!pe) {
            console.error(oProperty)
            throw new ReferenceError(`Property ${oProperty.type} program has not been defined`)
        }
        if (sMethod in pe) {
            return pe[sMethod]({
                property: oProperty,
                item: oItem,
                creature: oCreature,
                ...oParams
            })
        }
        return undefined
    }

    /**
     * @typedef RBSProperty
     * @property type {string} PROPERTY_*
     * @property amp {number|string}
     * @property data {object}
     *
     * @param sPropertyType {string} PROPERTY_*
     * @param amp {number|string}
     * @param oPropertyDefinition {object}
     * @return {RBSProperty}
     */
    buildProperty ({ type: sPropertyType, amp = 0, ...oPropertyDefinition }) {
        const oProperty = {
            type: sPropertyType,
            amp,
            data: {}
        }
        this.invokePropertyMethod(oProperty, 'init', null, null, oPropertyDefinition)
        return oProperty
    }
}

module.exports = PropertyBuilder
