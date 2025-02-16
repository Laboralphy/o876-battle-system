const ServiceAbstract = require('./ServiceAbstract')

class Properties extends ServiceAbstract {
    /**
     * Returns a list of properties affected to entity
     * @param idEntity
     * @returns {RBSProperty[]}
     */
    getProperties (idEntity) {
        this.services.entities.switchEntityType(
            idEntity,
            {
                creature: (oCreature) => oCreature.getters.getProperties,
                item: (oItem) => oItem.properties.slice(0)
            }
        )
    }

    /**
     * Adds a new property to an item or a creature
     * @param idEntity {string}
     * @param property {RBSProperty}
     */
    addProperty (idEntity, property) {
        const pb = this.services.core.manager.propertyBuilder
        const p = pb.buildProperty(property)
        this.services.entities.switchEntityType(
            idEntity,
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
