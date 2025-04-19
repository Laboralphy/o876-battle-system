class Horde {
    constructor () {
        this._creatures = new Map();
        // list of creatures that have running effect or action cooling down
        this._activeCreatures = new Set();
    }

    getCreature (id) {
        return this._creatures.get(id);
    }

    get creatures () {
        return this._creatures;
    }

    get count () {
        return this._creatures.size;
    }

    forEach (f) {
        const aCreatures = this._creatures.values();
        for (let index = 0, l = this.count; index < l; ++index) {
            const creature = aCreatures[index];
            f(creature, index, aCreatures);
        }
    }

    linkCreature (oCreature) {
        this._creatures.set(oCreature.id, oCreature);
    }

    unlinkCreature (oCreature) {
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
            oCreature.getters.getActiveProperties.length > 0;
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
