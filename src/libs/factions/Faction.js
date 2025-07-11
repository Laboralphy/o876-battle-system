/**
 * Faction de base
 * PC: Faction des joueurs
 * HOSTILE: Faction des PNJ hostiles aux autres faction
 * COMMONER: Faction des PNJ non combattant (gens du peuple)
 * MERCHANT: Faction des commerçants
 * DEFENDER: Faction des PNJ amicaux envers tous les autres
 */
class Faction {
    constructor (id, oParentFaction = null) {
        this._id = id;
        /**
         * @type {Map<string, number>}
         * @private
         */
        this._factionDispositions = new Map();
        this._parentFaction = oParentFaction;
        this.setFactionDisposition(this, 1);
    }

    get id () {
        return this._id;
    }

    /**
     * Define disposition of a given faction against this faction
     * HOSTILE : both faction are hostile each other.
     * NEUTRE : no reaction between those two factions
     * AMICAL : if a faction member M is attacked, members of friendly factions will attack aggressor of M
     * @param oFaction {Faction}
     * @param nDisposition {number} -1 hostile ; +1 amical ; 0 neutre
     */
    setFactionDisposition (oFaction, nDisposition) {
        this._factionDispositions.set(oFaction.id, nDisposition);
    }

    /**
     * Returns disposition of a faction against this faction
     * @param oFaction {Faction}
     * @returns {number}
     */
    getFactionDisposition (oFaction) {
        if (this._factionDispositions.has(oFaction.id)) {
            return this._factionDispositions.get(oFaction.id);
        }
        if (this._parentFaction) {
            return this._parentFaction.getFactionDisposition(oFaction);
        }
        return 0;
    }
}

module.exports = Faction;
