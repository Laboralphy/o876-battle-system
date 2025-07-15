const FactionManager = require('./libs/factions/FactionManager');
const LocationRegistry = require('./libs/location-registry');

class Horde {
    constructor () {
        this._creatures = new Map();
        // list of creatures that have running effect or action cooling down
        this._activeCreatures = new Set();
        this._factionManager = new FactionManager();
        this._locationRegistry = new LocationRegistry();
    }

    /**
     *
     * @returns {FactionManager}
     */
    get factionManager () {
        return this._factionManager;
    }

    /**
     *
     * @returns {LocationRegistry}
     */
    get locationRegistry () {
        return this._locationRegistry;
    }

    /**
     * Returns all creature in a given location
     * @param idLocation {string}
     * @returns {Creature[]}
     */
    getLocationCreatures (idLocation) {
        return this
            ._locationRegistry
            .getLocationEntities(idLocation)
            .map(c => this._creatures.get(c));
    }

    /**
     *
     * @param oCreature {Creature}
     * @param idLocation {string}
     */
    setCreatureLocation (oCreature, idLocation) {
        this._locationRegistry.setEntityLocation(oCreature.id, idLocation);
    }

    setCreatureFaction (oCreature, idFaction) {
        this._factionManager.setEntityFaction(oCreature.id, this._factionManager.getFaction(idFaction));
    }

    getCreatureFaction (oCreature) {
        return this._factionManager.getEntityFaction(oCreature.id);
    }

    /**
     * returns all hostile creatures in the same area of subject
     * @param oSubjectCreature {Creature}
     * @returns {Creature[]}
     */
    getSubjectHostileCreatures (oSubjectCreature) {
        return this
            ._locationRegistry
            .getLocationEntities(this._locationRegistry.getEntityLocation(oSubjectCreature.id))
            .filter(c => this._factionManager.isHostile(oSubjectCreature.id, c))
            .map(c => this._creatures.get(c));
    }

    /**
     * returns all friendly creatures in the same area of subject
     * @param oSubjectCreature {Creature}
     * @returns {Creature[]}
     */
    getSubjectFriendlyCreatures (oSubjectCreature) {
        return this
            ._locationRegistry
            .getLocationEntities(this._locationRegistry.getEntityLocation(oSubjectCreature.id))
            .filter(c => this._factionManager.isFriendly(oSubjectCreature.id, c))
            .map(c => this._creatures.get(c));
    }

    /**
     * returns all neutral creatures in the same area of subject
     * @param oSubjectCreature {Creature}
     * @returns {Creature[]}
     */
    getSubjectNeutralCreatures (oSubjectCreature) {
        return this
            ._locationRegistry
            .getLocationEntities(this._locationRegistry.getEntityLocation(oSubjectCreature.id))
            .filter(c => this._factionManager.isNeutral(oSubjectCreature.id, c))
            .map(c => this._creatures.get(c));
    }

    /**
     *
     * @param id {string} creature identified
     * @returns {Creature|undefined} creature instance if found, undeifned if not found
     */
    getCreature (id) {
        return this._creatures.get(id);
    }

    /**
     * return true if creature identifier exists in horde
     * @param id {string} searched identifier
     * @returns {boolean}
     */
    hasCreature (id) {
        return this._creatures.has(id);
    }

    /**
     * @returns {Map<string, Creature>}
     */
    get creatures () {
        return this._creatures;
    }

    /**
     * Returns number of defined creature
     * @returns {number}
     */
    get count () {
        return this._creatures.size;
    }

    /**
     * link a creature in the horde
     * @param oCreature {Creature}
     */
    linkCreature (oCreature) {
        this._creatures.set(oCreature.id, oCreature);
    }

    /**
     * remove a creature from the horde
     * @param oCreature {Creature}
     */
    unlinkCreature (oCreature) {
        this._locationRegistry.removeEntity(oCreature.id);
        this._factionManager.removeEntity(oCreature.id);
        this._activeCreatures.delete(oCreature);
        this._creatures.delete(oCreature.id);
    }

    /**
     * Marks the specified creature as active
     * @param oCreature {Creature}
     */
    setCreatureActive (oCreature) {
        this._activeCreatures.add(oCreature);
    }

    /**
     * Returns true if a creature has action cooling down or effect running
     * @param oCreature {Creature}
     * @returns {boolean}
     */
    isCreatureActive (oCreature) {
        return oCreature.getters.getEffects.length > 0 ||
            Object.values(oCreature.getters.getActions).some(action => action.cooldown > 0) ||
            oCreature.getters.getActiveProperties.length > 0 ||
            oCreature.getters.hasSpellSlotCoolingDown;
    }

    /**
     * Check if any active creature become inactive.
     * Removes inactive creatures from active creature registry
     */
    shrinkActiveCreatureRegistry () {
        const tac = this._activeCreatures;
        if (tac.size === 0) {
            return;
        }
        this.activeCreatures.forEach(creature => {
            if (!this.isCreatureActive(creature)) {
                tac.delete(creature);
            }
        });
    }

    /**
     * Returns all active creatures
     * @returns {any[]}
     */
    get activeCreatures () {
        return Array.from(this._activeCreatures);
    }
}

module.exports = Horde;
