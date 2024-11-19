const crypto = require('crypto')
const { deepMerge, deepFreeze} = require('@laboralphy/object-fusion')
const { getUniqueId } = require('./libs/unique-id')
const CONSTS = require('./consts')
const Creature = require('./Creature')
const {sortByDependency} = require("./libs/sort-by-dependency");


/**
 * This class takes blueprints, and create real items out of them
 */
class EntityBuilder {
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
        const aIdentifiedBlueprints = Object
            .entries(value)
            .map(([key, bp]) => ({
                ref: key,
                ...bp
            }))
        const aSortedBlueprints = sortByDependency(aIdentifiedBlueprints, 'ref', 'extends')
        aSortedBlueprints.forEach(blueprint => {
            this.defineBlueprint(blueprint.ref, blueprint)
        })
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
    defineBlueprint (id, blueprint) {
        if (id in this._blueprints) {
            throw new Error(`blueprint ${id} is already defined`)
        }
        const oBuiltBlueprint = {}
        if ('extends' in blueprint) {
            const aExtends = Array.isArray(blueprint.extends) ? blueprint.extends : [blueprint.extends]
            aExtends.forEach(x => {
                if (x in this._blueprints) {
                    deepMerge(oBuiltBlueprint, this._blueprints[x])
                } else {
                    throw new Error(`blueprint ${id} extends from an non-existant blueprint ${x}`)
                }
            })
        }
        deepMerge(oBuiltBlueprint, blueprint)
        delete oBuiltBlueprint.extends
        oBuiltBlueprint.ref = id
        if (!('properties' in oBuiltBlueprint)) {
            oBuiltBlueprint.properties = []
        }
        switch (oBuiltBlueprint.entityType) {
            case CONSTS.ENTITY_TYPE_ITEM: {
                this._schemaValidator.validate(oBuiltBlueprint, 'blueprint-item')
                break
            }

            case CONSTS.ENTITY_TYPE_ACTOR: {
                break
            }
        }
        return this._blueprints[id] = deepFreeze(oBuiltBlueprint)
    }

    _hashObject (oObject) {
        const sObject = JSON.stringify(oObject)
        return crypto.createHash('md5').update(sObject).digest('hex')
    }

    _checkResRef (resref) {
        if (!(resref in this._blueprints)) {
            throw new Error(`resref ${resref} does not lead to a defined blueprint`)
        }
        return this._blueprints[resref]
    }

    _registerUnidentifiedBlueprint (blueprint) {
        const sHash = this._hashObject(blueprint)
        if (sHash in this._blueprints) {
            return this._blueprints[sHash]
        } else {
            return this.defineBlueprint(sHash, blueprint)
        }
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
    createItemFromResRef (resref, id) {
        const oBlueprint = this._checkResRef(resref)
        return {
            id: id || getUniqueId(),
            blueprint: oBlueprint,
            remainingCharges: oBlueprint.charges || 0,
            properties: [
                ...oBlueprint.properties
            ]
        }
    }

    createCreatureFromResRef (resref, id = undefined) {
        const oBlueprint = this._checkResRef(resref)
        return new Creature({ blueprint: oBlueprint, id })
    }

    createEntity (blueprint, id) {
        const bp = this._registerUnidentifiedBlueprint(blueprint)
        const idbp = bp.ref
        switch (bp.entityType) {
            case CONSTS.ENTITY_TYPE_ITEM: {
                return this.createItemFromResRef(idbp, id)
            }

            case CONSTS.ENTITY_TYPE_ACTOR: {
                return this.createCreatureFromResRef(idbp, id)
            }

            default: {
                throw new Error(`What the hell is this blueprint : ${idbp} / ${bp.entityType} ?`)
            }
        }
    }
}

module.exports = EntityBuilder
