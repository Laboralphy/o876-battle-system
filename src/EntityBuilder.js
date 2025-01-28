const crypto = require('crypto')
const { deepMerge, deepFreeze} = require('@laboralphy/object-fusion')
const { getUniqueId } = require('./libs/unique-id')
const CONSTS = require('./consts')
const Creature = require('./Creature')
const { sortByDependency } = require('./libs/sort-by-dependency')
const PropertyBuilder = require('./PropertyBuilder')

/**
 * This class takes blueprints, and create real items out of them
 */
class EntityBuilder {
    constructor () {
        this._blueprints = {}
        this._schemaValidator = null
        this._propertyBuilder = new PropertyBuilder()
    }

    /**
     *
     * @returns {PropertyBuilder}
     */
    get propertyBuilder () {
        return this._propertyBuilder
    }

    set schemaValidator (value) {
        this._schemaValidator = value
    }

    get schemaValidator () {
        if (!this._schemaValidator) {
            throw new ReferenceError('no schema validator has been defined for this instance')
        }
        return this._schemaValidator
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
     * @property [damageType] {string} weapon damage type list
     * @property weight {number} item weight
     * @property [attributes] {string[]} weapon attribute list
     * @property [size] {string} weapon size
     * @property [charges] {number} maximum number of charges
     * @property [equipmentSlots] {string[]} list of slot where item can be equipped
     * @property [ac] {number}
     * @property [maxDexterityBonus] {number}
     * @property properties {RBSProperty[]}
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
        try {
            switch (oBuiltBlueprint.entityType) {
                case CONSTS.ENTITY_TYPE_ITEM: {
                    this.schemaValidator.validate(oBuiltBlueprint, 'blueprint-item')
                    break
                }

                case CONSTS.ENTITY_TYPE_ACTOR: {
                    this.schemaValidator.validate(oBuiltBlueprint, 'blueprint-actor')
                    break
                }
            }
        } catch (e) {
            throw new Error(`Schema validation error on blueprint : ${id}`, { cause: e })
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

    /**
     * Register a blueprint without identifier, builds an identifier out of blueprint serialisation
     * @param blueprint {RBSItemBlueprint}
     * @returns {Object|*}
     */
    _registerUnidentifiedBlueprint (blueprint) {
        if (typeof blueprint === 'string') {
            if (blueprint in this._blueprints) {
                return this._blueprints[blueprint]
            } else {
                throw new ReferenceError(`This blueprint does not exist ${blueprint}`)
            }
        }
        const sHash = this._hashObject(blueprint)
        if (sHash in this._blueprints) {
            return this._blueprints[sHash]
        } else {
            return this.defineBlueprint(sHash, blueprint)
        }
    }

    _buildProperties (aProperties) {
        return aProperties.map(p => this._propertyBuilder.buildProperty(p))
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
            tag: 'tag' in oBlueprint ? oBlueprint.tag : '',
            properties: this._buildProperties(oBlueprint.properties)
        }
    }

    createCreatureFromResRef (resref, id = undefined) {
        try {
            const oBlueprint = this._checkResRef(resref)
            const oCreature = new Creature({ blueprint: oBlueprint, id })
            this
                ._buildProperties(oBlueprint.properties)
                .forEach(property => oCreature.mutations.addProperty({ property }))
            Object
                .values(oBlueprint.equipment)
                .forEach(item => {
                    const oItem = this.createEntity(item)
                    oCreature.equipItem(oItem)
                })
            Object
                .values(oBlueprint.actions)
                .forEach(action => {
                    oCreature.mutations.defineAction(action)
                })
            return oCreature
        } catch (e) {
            throw new Error(`Could not build creature ${resref} : ${e.message}`, { cause: e })
        }
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
