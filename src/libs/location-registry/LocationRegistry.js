const GroupMemberRegistry = require('../group-member-registry');

/**
 * Registry to manage the locations of entities.
 */
class LocationRegistry extends GroupMemberRegistry {
    /**
     * Initializes a new instance of the LocationRegistry.
     */
    constructor () {
        super();
        this._environmentRegistry = new Map();
    }

    getLocationEnvironment (idLocation) {
        if (this._environmentRegistry.has(idLocation)) {
            const er = this._environmentRegistry.get(idLocation);

        } else {
            return;
        }
    }

    setLocationEnvironment (environment, value) {

    }

    /**
     * Retrieves the location ID of a specified entity.
     * @param {string} idEntity - The ID of the entity.
     * @returns {string|undefined} The location ID of the entity, or undefined if the entity is not found.
     */
    getEntityLocation (idEntity) {
        return this.getMemberGroup(idEntity);
    }

    /**
     * Sets the location of a specified entity.
     * @param {string} idEntity - The ID of the entity.
     * @param {string} idLocation - The ID of the location to set for the entity.
     */
    setEntityLocation (idEntity, idLocation) {
        return this.setMemberGroup(idEntity, idLocation);
    }

    /**
     * Retrieves all entities located at a specified location.
     * @param {string} idLocation - The ID of the location.
     * @returns {Array<string>} An array of entity IDs located at the specified location.
     */
    getLocationEntities (idLocation) {
        return this.getGroupMembers(idLocation);
    }

    /**
     * Removes an entity from the registry.
     * @param {string} idEntity - The ID of the entity to remove.
     */
    removeEntity (idEntity) {
        return this.removeMember(idEntity);
    }
}

module.exports = LocationRegistry;
