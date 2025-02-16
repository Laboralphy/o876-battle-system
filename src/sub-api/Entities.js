const ServiceAbstract = require('./ServiceAbstract')

class Entities extends ServiceAbstract {
    constructor() {
        super()
        this._entities = {}
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
     * Call one of the specfied callback according to specified entity type
     * @param idEntity {string} entity identifier
     * @param creature {function(Creature)} function to run if entity type is creature
     * @param item {function(RBSItem)} function to run if entity type is item
     * @returns {*}
     */
    switchEntityType (idEntity, { creature, item }) {
        if (creature && this.services.creatures.isCreature(idEntity)) {
            return creature(this.services.creatures.getCreature(idEntity))
        } else if (this.services.items.isItem(idEntity)) {
            return item(this.services.core.getEntity(idEntity))
        }
    }
}

module.exports = Entities