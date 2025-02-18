const ServiceAbstract = require('./ServiceAbstract')

class Properties extends ServiceAbstract {
    /**
     * Returns a list of properties affected to entity
     * @param oEntity {BoxedCreature|BoxedItem}
     * @returns {RBSProperty[]}
     */
    getProperties (oEntity) {
        if (oEntity instanceof BoxedObject) {
            return oEntity.properties
        } else {
            throw new TypeError('parameter must be BoxedObject')
        }
    }

    /**
     * Adds a new property to an item or a creature
     * @param oEntity {BoxedCreature|BoxedItem}
     * @param property {RBSProperty}
     */
    addProperty (oEntity, property) {
        const pb = this.services.core.manager.propertyBuilder
        const p = pb.buildProperty(property)
        this.services.entities.switchEntityType(
            oEntity,
            {
                creature: (oCreature) => {
                    oCreature.mutations.addProperty({ property: p })
                },
                item: (oItem) => oItem.properties.push(p)
            }
        )
    }

    /**
     * Removes a property from an item or a creature
     * @param idEntity
     * @param property
     */
    removeProperty (idEntity, property) {
        this.services.entities.switchEntityType(
            idEntity,
            {
                creature: (oCreature) => oCreature.mutations.removeProperty({ property }),
                item: (oItem) => {
                    const iProp = oItem.properties.findIndex(p => p.id === property.id)
                    if (iProp >= 0) {
                        oItem.properties.splice(iProp, 1)
                    }
                }
            }
        )
    }
}

module.exports = Properties
