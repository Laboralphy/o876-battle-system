const ServiceAbstract = require('./ServiceAbstract');
const Creature = require('../Creature');
const BoxedCreature = require('./classes/BoxedCreature');
const BoxedItem = require('./classes/BoxedItem');
const BoxedObject = require('./classes/BoxedObject');

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

    /**
     * Returns a list of properties affected to entity
     * @param oEntity {BoxedCreature|BoxedItem}
     * @returns {RBSProperty[]}
     */
    getProperties (oEntity) {
        if (oEntity instanceof BoxedObject) {
            return oEntity.properties;
        } else {
            throw new TypeError('parameter must be BoxedObject');
        }
    }

    /**
     * Creates a new property. The property can be applied to a creature or an item
     * @param sType {string}
     * @param amp {number|string}
     * @param data {Object<string, number | string>}
     */
    createProperty (sType, amp, data) {
        /**
         * @type {PropertyBuilder}
         */
        const pb = this.services.core.manager.propertyBuilder;
        return pb.buildProperty({
            type: this.services.core.checkConstProperty(sType),
            amp,
            ...data
        });
    }

    /**
     * Finds a list of property by their type
     * @param oEntity {BoxedItem|BoxedCreature}
     * @param sType {string} PROPERTY_*
     * @return {RBSProperty[]}
     */
    findProperty (oEntity, sType) {
        this.services.core.checkConstProperty(sType);
        this.switchEntityType(oEntity, {
            creature: creature => creature.getters.getInnateProperties.filter(p => p.type === sType),
            item: item => item.properties.filter(p => p.type === sType)
        });
    }

    /**
     * Adds a new property to an item or a creature
     * @param oEntity {BoxedCreature|BoxedItem}
     * @param property {RBSProperty}
     */
    addProperty (oEntity, property) {
        this.switchEntityType(
            oEntity,
            {
                creature: (oCreature) => {
                    oCreature.mutations.addProperty({ property });
                },
                item: (oItem) => oItem.properties.push(property)
            }
        );
    }

    /**
     * Removes a property from an item or a creature
     * @param oEntity {BoxedCreature|BoxedItem}
     * @param property {RBSProperty}
     */
    removeProperty (oEntity, property) {
        this.switchEntityType(
            oEntity,
            {
                creature: (oCreature) => oCreature.mutations.removeProperty({ property }),
                item: (oItem) => {
                    const iProp = oItem.properties.findIndex(p => p.id === property.id);
                    if (iProp >= 0) {
                        oItem.properties.splice(iProp, 1);
                    }
                }
            }
        );
    }
}

module.exports = Entities;
