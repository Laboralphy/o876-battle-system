const Faction = require('./Faction');
const GroupMemberRegistry = require('../group-member-registry');
const {sortByDependency} = require('../sort-by-dependency');

class FactionManager {
    constructor () {
        this._gmr = new GroupMemberRegistry();
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
     * @typedef FactionDefinition {object}
     * @property id {string}
     * @property parent {string|undefined}
     * @property relations {{ [idFaction: string ]: number }}
     *
     * @param aDef {FactionDefinition[]}
     */
    defineFactions (aDef) {
        const aDep = sortByDependency(aDef, 'id', 'parent');
        aDep.forEach(d => {
            const oParent = 'parent' in d ? this.getFaction(d.parent) : null;
            this.defineFaction(d.id, oParent);
        });
        aDep.forEach(d => {
            const idThisFaction = d.id;
            /**
             * @var {Faction}
             */
            const oThisFaction = this.getFaction(idThisFaction);
            if (!oThisFaction) {
                console.error(idThisFaction, 'does not exist');
                throw 'wtf';
            }
            Object
                .entries(d.relations)
                .forEach(([idOtherFaction, nValue]) => {
                    const oOtherFaction = this.getFaction(idOtherFaction);
                    oThisFaction.setFactionDisposition(oOtherFaction, nValue);
                });
        });
    }

    /**
     * Return the specified faction by id
     * @param id {string}
     * @returns {Faction|null}
     */
    getFaction (id) {
        if (this._factions.has(id)) {
            return this._factions.get(id);
        } else {
            return null;
        }
    }

    /**
     * Define a faction for the specified entity
     * @param idEntity {string}
     * @param oFaction {Faction}
     */
    setEntityFaction (idEntity, oFaction) {
        this._gmr.setMemberGroup(idEntity, oFaction.id);
    }

    /**
     * Retrieve entity faction if any
     * Throws an error if entity has no faction
     * @param idEntity {string}
     * @returns {Faction}
     */
    getEntityFaction (idEntity) {
        const idFaction = this._gmr.getMemberGroup(idEntity);
        if (!idFaction) {
            throw new Error(`this entity ${idEntity} has no assigned faction`);
        }
        const oFaction = this._factions.get(idFaction);
        if (!oFaction) {
            throw new Error(`this entity ${idEntity} is assigned to faction ${idFaction} which does not exist`);
        }
        return oFaction;
    }

    /**
     * Returns true if subject sees object as hostile
     * @param idSubject {string} entity id
     * @param idObject {string} entity id
     * @return {boolean}
     */
    isHostile (idSubject, idObject) {
        return this.getEntityFaction(idSubject).isHostile(this.getEntityFaction(idObject));
    }

    /**
     * Returns true if subject sees object as neutral
     * @param idSubject {string} entity id
     * @param idObject {string} entity id
     * @return {boolean}
     */
    isNeutral (idSubject, idObject) {
        return this.getEntityFaction(idSubject).isNeutral(this.getEntityFaction(idObject));
    }

    /**
     * Returns true if subject sees object as friendly
     * @param idSubject {string} entity id
     * @param idObject {string} entity id
     * @return {boolean}
     */
    isFriendly (idSubject, idObject) {
        return this.getEntityFaction(idSubject).isFriendly(this.getEntityFaction(idObject));
    }

    removeEntity (idEntity) {
        this._gmr.removeMember(idEntity);
    }
}

module.exports = FactionManager;
