const Abstract = require('./Abstract')
const CONSTS = require('../consts')
const { checkConst } = require('../libs/check-const')
const Manager = require('../Manager')
const Creature = require('../Creature')

const PREFIXES = {
    ABILITY: 'ABILITY_',
    CAPABILITY: 'CAPABILITY_',
    CONDITION: 'CONDITION_',
}

class Core extends Abstract {
    constructor (services) {
        super(services)
        this._manager = new Manager()
        /**
         * @type {{[id: string]: RBSItem | Creature}}
         * @private
         */
        this._entities = {}
    }

    get PREFIXES () {
        return PREFIXES
    }

    get CONSTS () {
        return CONSTS
    }

    /**
     * @returns {Manager}
     */
    get manager () {
        return this._manager
    }

    /**
     * Returns an entity
     * @param id {string} entity identifier
     * @returns {Creature | RBSItem}
     */
    getEntity (id) {
        if (this.isEntityExists(id)) {
            return this._entities[id]
        } else {
            throw new Error(`entity ${id} not found`)
        }
    }

    /**
     * Returns true if an entity with the specified identifier exists
     * @param id {string}
     * @returns {boolean}
     */
    isEntityExists (id) {
        return id in this._entities
    }

    /**
     * Creates an entity
     * @param resref {string} resource reference
     * @param id {string} identifier
     * @returns {Creature|RBSItem}
     */
    createEntity (resref, id) {
        if (this.isEntityExists(id)) {
            throw new Error(`duplicating entity id ${id}`)
        }
        const oEntity = this.manager.createEntity(resref, id)
        this._entities[id] = oEntity
        return oEntity.id
    }

    /**
     * Destroys an entity previously created by createEntity()
     * @param id {string} entity identifier
     */
    destroyEntity (id) {
        this._services.core.manager.destroyEntity(this.getEntity(id))
        delete this._entities[id]
    }


    /**
     * Validate constant with prefix
     * @param sConstName {string}
     * @param sPrefix {string}
     * @returns {string}
     */
    checkConst (sConstName, sPrefix = '') {
        if (sPrefix !== '' && !sConstName.startsWith(sPrefix)) {
            throw new Error(`invalid value ${sConstName}. must start with ${sPrefix}`)
        }
        return checkConst(sConstName)
    }
}

module.exports = Core