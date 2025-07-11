/**
 * Registry to manage the locations of entities.
 */
class LocationRegistry {
    /**
     * Initializes a new instance of the LocationRegistry.
     */
    constructor () {
        this._locations = new Map();
        this._entities = new Map();
    }

    /**
     * Retrieves the location ID of a specified entity.
     * @param {number} idEntity - The ID of the entity.
     * @returns {number|undefined} The location ID of the entity, or undefined if the entity is not found.
     */
    getEntityLocation (idEntity) {
        return this._entities.get(idEntity);
    }

    /**
     * Sets the location of a specified entity.
     * @param {number} idEntity - The ID of the entity.
     * @param {number} idLocation - The ID of the location to set for the entity.
     */
    setEntityLocation (idEntity, idLocation) {
        const idPrevLocation = this.getEntityLocation(idEntity);
        if (idPrevLocation) {
            this.getLocationRegistry(idPrevLocation).delete(idEntity);
        }
        this.getLocationRegistry(idLocation).add(idEntity);
        this._entities.set(idEntity, idLocation);
    }

    /**
     * Retrieves all entities located at a specified location.
     * @param {number} idLocation - The ID of the location.
     * @returns {Array<number>} An array of entity IDs located at the specified location.
     */
    getLocationEntities (idLocation) {
        if (this._locations.has(idLocation)) {
            return [...this._locations.get(idLocation)];
        } else {
            return [];
        }
    }

    /**
     * Retrieves the registry of entities for a specified location.
     * If the location does not exist, it initializes it.
     * @param {number} idLocation - The ID of the location.
     * @returns {Set<number>} The set of entity IDs located at the specified location.
     */
    getLocationRegistry (idLocation) {
        if (!this._locations.has(idLocation)) {
            this._locations.set(idLocation, new Set());
        }
        return this._locations.get(idLocation);
    }

    /**
     * Removes an entity from the registry.
     * @param {number} idEntity - The ID of the entity to remove.
     */
    removeEntity (idEntity) {
        const idEntityLocation = this.getEntityLocation(idEntity);
        if (idEntityLocation) {
            this._entities.delete(idEntity);
            this._locations.get(idEntityLocation).delete(idEntity);
        }
    }
}

module.exports = LocationRegistry;
