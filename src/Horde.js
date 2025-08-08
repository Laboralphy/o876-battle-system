const { getUniqueId } = require('./libs/unique-id');
const FactionManager = require('./libs/factions/FactionManager');
const LocationRegistry = require('./libs/location-registry');
const CONSTS = require('./consts');
const ENVIRONMENTS = [
    CONSTS.ENVIRONMENT_FOG,
    CONSTS.ENVIRONMENT_DARKNESS,
    CONSTS.ENVIRONMENT_WINDY,
    CONSTS.ENVIRONMENT_UNDERWATER,
    CONSTS.ENVIRONMENT_DIFFICULT_TERRAIN
];

class Horde {
    constructor () {
        this._creatures = new Map();
        // list of creatures that have running effect or action cooling down
        this._activeCreatures = new Set();
        this._factionManager = new FactionManager();
        this._locationRegistry = new LocationRegistry();
        this._locationEnvironmentRegistry = new Map();
        this._locationTemporaryEnvironments = [];
    }

    /**
     *
     * @param idLocation
     * @param sEnvironment
     * @param nDuration
     * @returns {LocationTemporaryEnvironment}
     */
    addTemporaryEnvironment (idLocation, sEnvironment, nDuration) {
        /**
         * @typedef LocationTemporaryEnvironment {Object}
         * @property id {string}
         * @property environment {string}
         * @property duration {number}
         * @property location {string}
         */
        const e = {
            id: getUniqueId(),
            environment: sEnvironment,
            duration: nDuration,
            location: idLocation
        };
        this._locationTemporaryEnvironments.push(e);
        this.updateLocationEnvironment(e.id);
        return e;
    }

    getLocationTemporaryEnvironments (idLocation) {
        return this._locationTemporaryEnvironments.filter(env => env.location === idLocation);
    }

    removeTemporaryEnvironment (id) {
        const i = this._locationTemporaryEnvironments.findIndex(e => e.id === id);
        if (i >= 0) {
            const e = this._locationTemporaryEnvironments[i];
            this._locationTemporaryEnvironments.splice(i, 1);
            this.updateLocationEnvironment(e.location);
        }
    }

    depleteTemporaryEnvironmentDurations () {
        this
            ._locationTemporaryEnvironments
            .filter(e => --e.duration <= 0)
            .forEach(e => {
                this.removeTemporaryEnvironment(e.id);
            });
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
     * Change creature environments
     * @param oCreature {Creature}
     * @param aEnvironments {string[]}
     */
    updateCreatureEnvironment (oCreature, aEnvironments) {
        const e = new Set(aEnvironments);
        const ec = oCreature.getters.getEnvironment;
        ENVIRONMENTS.forEach(env => {
            const bNewEnv = e.has(env);
            const bOldEnv = ec[env];
            const m = (bNewEnv ? 10 : 0) + (bOldEnv ? 1 : 0);
            switch (m) {
            case 0:
            case 11: {
                // this env is not on creature, and not in new room
                // or this env is both on creature and in new room
                // don't change anything
                break;
            }

            case 10: {
                // env is in new room, but creature does not have it yet
                // add it to creature
                oCreature.mutations.setEnvironment({ environment: env, value: true });
                break;
            }

            case 1: {
                // env is in creature but not in new room
                // remove it from creature
                oCreature.mutations.setEnvironment({ environment: env, value: false });
            }
            }
        });
    }

    getLocationEnvironment (idLocation) {
        const aPermEnv = this._locationEnvironmentRegistry.get(idLocation) || [];
        const aTempEnv = this
            .getLocationTemporaryEnvironments(idLocation)
            .map(env => env.environment);
        return Array.from(new Set([...aPermEnv, ...aTempEnv]));
    }

    updateCreatureLocationEnvironment (oCreature) {
        const idLocation = this.getCreatureLocation(oCreature);
        this.updateCreatureEnvironment(oCreature, this.getLocationEnvironment(idLocation));
    }

    updateLocationEnvironment (idLocation) {
        const aCreatures = this.getLocationCreatures(idLocation);
        aCreatures.forEach(c => this.updateCreatureLocationEnvironment(c));
    }

    /**
     * Define/update room environment
     * @param idLocation {string}
     * @param aEnvironments {string[]}
     */
    setLocationEnvironment (idLocation, aEnvironments) {
        this._locationEnvironmentRegistry.set(idLocation, aEnvironments);
        this
            .getLocationCreatures(idLocation)
            .forEach(creature => {
                this.updateCreatureLocationEnvironment(creature);
            });
    }

    /**
     *
     * @param oCreature {Creature}
     * @param idLocation {string}
     */
    setCreatureLocation (oCreature, idLocation) {
        this._locationRegistry.setEntityLocation(oCreature.id, idLocation);
        this.updateCreatureLocationEnvironment(oCreature);
    }

    /**
     *
     * @param oCreature {Creature}
     * @return {string}
     */
    getCreatureLocation (oCreature) {
        return this._locationRegistry.getEntityLocation(oCreature.id);
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
