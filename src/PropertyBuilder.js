const PROPERTIES = require('./properties')

const SYMBOL_ACTIVE_PROPERTY = Symbol('SYMBOL_ACTIVE_PROPERTY')

class PropertyBuilder {

    constructor () {
        this._propertyPrograms = null
        this.propertyPrograms = PROPERTIES
        this._aMutatingProperties = new Set()
    }

    static get SYMBOL_ACTIVE_PROPERTY () {
        return SYMBOL_ACTIVE_PROPERTY
    }

    static isPropertyActive (oProperty) {
        return oProperty.data[SYMBOL_ACTIVE_PROPERTY] ?? false
    }

    get propertyPrograms () {
        return this._propertyPrograms
    }

    set propertyPrograms (value) {
        this._propertyPrograms = Object.seal(value)
        this._aMutatingProperties = new Set(
            Object
                .entries(this._propertyPrograms)
                .filter(([sPropName, property]) => ('mutate' in property))
                .map(([sPropName]) => sPropName)
        )
    }

    get mutatingProperties () {
        return this._aMutatingProperties
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
     * @property active {boolean} if true then this property is running "mutate" function each turn
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
        if (this._aMutatingProperties.has(sPropertyType)) {
            oProperty.data[SYMBOL_ACTIVE_PROPERTY] = true
        }
        this.invokePropertyMethod(oProperty, 'init', null, null, oPropertyDefinition)
        return oProperty
    }
}

module.exports = PropertyBuilder
