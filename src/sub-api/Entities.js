const ServiceAbstract = require('./ServiceAbstract')
const Creature = require('../Creature')
const BoxedCreature = require('./classes/BoxedCreature')
const BoxedItem = require('./classes/BoxedItem')

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
     * @returns {BoxedCreature|RBSItem}
     */
    createEntity (resref, id) {
        if (this.isEntityExists(id)) {
            throw new Error(`duplicating entity id ${id}`)
        }
        const oEntity = this.manager.createEntity(resref, id)
        this._entities[id] = oEntity
        return oEntity instanceof Creature ? new BoxedCreature(oEntity) : new BoxedItem(oEntity)
    }

    /**
     * Destroys an entity previously created by createEntity()
     * @param oEntity {BoxedCreature|BoxedItem} entity identifier
     */
    destroyEntity (oEntity) {
        this._services.core.manager.destroyEntity(oEntity.id)
        delete this._entities[oEntity.id]
    }

    /**
     * Call one of the specfied callback according to specified entity type
     * @param oEntity {BoxedCreature|BoxedItem} entity identifier
     * @param creature {function(Creature)} function to run if entity type is creature
     * @param item {function(RBSItem)} function to run if entity type is item
     * @returns {*}
     */
    switchEntityType (oEntity, { creature, item }) {
        if (creature && oEntity.isCreature) {
            return creature(oEntity[BoxedCreature.SYMBOL_BOXED_OBJECT])
        } else if (item && oEntity.isItem) {
            return item(oEntity[BoxedCreature.SYMBOL_BOXED_OBJECT])
        }
    }
}

module.exports = Entities