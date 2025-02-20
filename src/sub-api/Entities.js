const ServiceAbstract = require('./ServiceAbstract');
const Creature = require('../Creature');
const BoxedCreature = require('./classes/BoxedCreature');
const BoxedItem = require('./classes/BoxedItem');

class Entities extends ServiceAbstract {
    constructor() {
        super();
        this._entities = new Map();
    }

    /**
     * Returns true if an entity with the specified identifier exists
     * @param id {string}
     * @returns {boolean}
     */
    entityExists (id) {
        return this._entities.has(id);
    }

    /**
     * Creates an entity
     * @param resref {string} resource reference
     * @param id {string} identifier
     * @returns {BoxedCreature|RBSItem}
     */
    createEntity (resref, id) {
        if (this.entityExists(id)) {
            throw new Error(`duplicating entity id ${id}`);
        }
        const oEntity = this.services.core.manager.createEntity(resref, id);
        const oBoxedEntity = oEntity instanceof Creature
            ? new BoxedCreature(oEntity)
            : new BoxedItem(oEntity);
        this._entities.set(id, oBoxedEntity);
        if (oBoxedEntity.isCreature) {
            Object
                .values(oEntity.getters.getEquipment)
                .filter(item => item !== null)
                .forEach(item => {
                    this._entities.set(item.id, new BoxedItem(item));
                });
        }
        return oBoxedEntity;
    }

    /**
     * Destroys an entity previously created by createEntity()
     * @param oEntity {BoxedCreature|BoxedItem} entity identifier
     */
    destroyEntity (oEntity) {
        if (oEntity.isCreature) {
            const m = this._services.core.manager;
            const eq = oEntity[BoxedCreature.SYMBOL_BOXED_OBJECT].getters.getEquipment;
            m.destroyEntity(oEntity[BoxedCreature.SYMBOL_BOXED_OBJECT]);
            Object
                .values(eq)
                .filter(item => item !== null)
                .forEach(item => {
                    this.destroyEntity(new BoxedItem(item));
                });
        }
        this._entities.delete(oEntity.id);
        oEntity.free();
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
