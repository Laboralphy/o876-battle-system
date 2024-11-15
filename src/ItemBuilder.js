const { deepMerge, deepClone} = require('@laboralphy/object-fusion')
const {getUniqueId} = require("./libs/unique-id");

/**
 * This class takes blueprints, and create real items out of them
 */
class ItemBuilder {
    constructor () {
        this._blueprints = {}
        this._schemaValidator = null
    }

    get schemaValidator () {
        return this._schemaValidator
    }

    set schemaValidator (value) {
        this._schemaValidator = value
    }

    get blueprints () {
        return this._blueprints
    }

    set blueprints (value) {
        this._blueprints = value
    }

    /**
     * @typedef RBSItemBlueprint {object}
     * @property ref {string} blueprint reference
     * @property entityType {string} entity type : always ENTITY_TYPE_ITEM
     * @property itemType {string} item type
     * @property proficiencies {string[]} item proficiency (condition to use efficiently)
     * @property [damages] {number|string} weapon damage amount (can be dice expression)
     * @property [damageTypes] {string[]} weapon damage type list
     * @property weight {number} item weight
     * @property [attributes] {string[]} weapon attribute list
     * @property [size] {string} weapon size
     * @property [charges] {number} maximum number of charges
     *
     * @param id
     * @param blueprint
     * @returns {RBSItemBlueprint}
     */
    defineItemBlueprint (id, blueprint) {
        if (id in this._blueprints) {
            throw new Error(`blueprint ${id} is already defined`)
        }
        const oBuiltBlueprint = {}
        if ('extends' in blueprint) {
            if (blueprint.extends in this._blueprints) {
                deepMerge(oBuiltBlueprint, this._blueprints[blueprint.extends])
            } else {
                throw new Error(`blueprint ${id} extends from an non-existant blueprint ${blueprint.extends}`)
            }
        }
        deepMerge(oBuiltBlueprint, blueprint)
        delete oBuiltBlueprint.extends
        oBuiltBlueprint.ref = id
        if (!('properties' in oBuiltBlueprint)) {
            oBuiltBlueprint.properties = []
        }
        this._schemaValidator.validate(oBuiltBlueprint, 'blueprint-item')
        return this._blueprints[id] = oBuiltBlueprint
    }

    /**
     * @typedef RBSItem {object}
     * @property id {string} item identifier
     * @property ref {string} blueprint reference
     * @property blueprint {RBSItemBlueprint}
     * @property remainingCharges {number} current number of charges
     * @property properties {[]} these property list can be altered (remov item, add item...)
     *
     * @param resref
     * @param id
     * @returns {*|Date|Set<unknown>|Set<any>|{}}
     */
    createItem (resref, id) {
        if (!(resref in this._blueprints)) {
            throw new Error(`resref ${resref} does not lead to a defined blueprint`)
        }
        const oBlueprint = this._blueprints[resref]
        return {
            id: id || getUniqueId(),
            blueprint: oBlueprint,
            remainingCharges: oBlueprint.charges || 0,
            properties: [
                ...oBlueprint.properties
            ]
        }
    }
}

module.exports = ItemBuilder
