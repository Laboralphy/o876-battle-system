const ServiceAbstract = require('./ServiceAbstract');
const Creature = require('../Creature');
const BoxedCreature = require('./classes/BoxedCreature');
const BoxedItem = require('./classes/BoxedItem');

class Entities extends ServiceAbstract {
    constructor() {
        super();
        this._entities = {};
    }

    /**
     * @param id {string}
     * @returns {BoxedItem|BoxedCreature|null}
     */
    getEntityById (id) {
        if (id in this._entities) {
            return this._entities[id];
        } else { // entity is gone
            return null;
        }
    }

    /**
     * Returns a boxed version of an entity
     * @param oEntity {Creature|RBSItem} entity identifier
     * @returns {Creature | RBSItem}
     */
    getEntity (oEntity) {
        if ('id' in oEntity) {
            if (oEntity.id in this._entities) {
                return this._entities[oEntity.id];
            } else { // entity is gone
                return null;
            }
        } else { // entity is invalid
            throw new Error('entity is invalid');
        }
    }

    /**
     * Returns true if an entity with the specified identifier exists
     * @param id {string}
     * @returns {boolean}
     */
    isEntityExists (id) {
        return id in this._entities;
    }

    /**
     * Creates an entity
     * @param resref {string} resource reference
     * @param id {string} identifier
     * @returns {BoxedCreature|RBSItem}
     */
    createEntity (resref, id) {
        if (this.isEntityExists(id)) {
            throw new Error(`duplicating entity id ${id}`);
        }
        const oEntity = this.services.core.manager.createEntity(resref, id);
        const oBoxedEntity = oEntity instanceof Creature
            ? new BoxedCreature(oEntity)
            : new BoxedItem(oEntity);
        this._entities[id] = oBoxedEntity;
        return oBoxedEntity;
    }

    /**
     * Destroys an entity previously created by createEntity()
     * @param oEntity {BoxedCreature|BoxedItem} entity identifier
     */
    destroyEntity (oEntity) {
        if (oEntity.isCreature) {
            this._services.core.manager.destroyEntity(oEntity[BoxedCreature.SYMBOL_BOXED_OBJECT]);
            delete this._entities[oEntity.id];
        }
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
            return creature(oEntity[BoxedCreature.SYMBOL_BOXED_OBJECT]);
        } else if (item && oEntity.isItem) {
            return item(oEntity[BoxedCreature.SYMBOL_BOXED_OBJECT]);
        } else {
            throw new TypeError('entity is invalid - neither creature nor item');
        }
    }
}

module.exports = Entities;
