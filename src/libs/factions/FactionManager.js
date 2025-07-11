const Faction = require('./Faction');

class FactionManager {
    constructor () {
        this._factions = new Map();
    }

    /**
     * Define a new faction
     * @param id
     * @param oParent
     * @returns {Faction|any}
     */
    defineFaction (id, oParent = null) {
        if (this._factions.has(id)) {
            return this._factions.get(id);
        } else {
            const f = new Faction(id, oParent);
            this._factions.set(id, f);
            return f;
        }
    }

    /**
     * Return the specified faction by id
     * @param id {number}
     * @returns {Faction|null}
     */
    getFaction (id) {
        if (this._factions.has(id)) {
            return this._factions.get(id);
        } else {
            return null;
        }
    }
}

module.exports = FactionManager;
