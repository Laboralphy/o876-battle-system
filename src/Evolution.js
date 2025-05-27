const CONSTS = require('./consts');

class Evolution {
    constructor ({ data }) {
        this._data = data;
    }

    getClassTypeKey (sClassType) {
        return sClassType
            .toUpperCase()
            .replace(/-/g, '_');
    }

    /**
     * Get class type data
     * @param sClassType {string}
     */
    getClassTypeData (sClassType) {
        const sClassTypeDataKey = this.getClassTypeKey(sClassType);
        if (sClassTypeDataKey in this._data) {
            return this._data[sClassTypeDataKey];
        } else {
            throw new Error(`class type ${sClassType} data are not defined`);
        }
    }

    /**
     * Get specificaly the evolution section of a class type data
     * @param sClassType
     */
    getClassTypeEvolutionData (sClassType) {
        const d = this.getClassTypeData(sClassType);
        if ('evolution' in d) {
            return d.evolution;
        } else {
            throw new Error(`no "evolution" property if class type ${sClassType} data`);
        }
    }

    /**
     * @typedef EvoSelectFeatGroup {object}
     * @property group {string}
     * @property count {number}
     * @property feats {string[]}
     *
     * Returns a specific level of an evolution data
     * @param sClassType {string}
     * @param nLevel {number}
     * @return {{ feats?: string[], removeFeats?: string[], level: number, selectFeatGroups: EvoSelectFeatGroup[] }}
     */
    getClassTypeEvolutionLevelData (sClassType, nLevel) {
        const cteld = this.getClassTypeEvolutionData(sClassType).find(d => d.level === nLevel);
        if (!cteld) {
            throw new Error(`no level ${nLevel} definition in class type ${sClassType}`);
        }
        return cteld;
    }


    /**
     *
     * @param oManager {Manager}
     * @param oCreature {Creature}
     */
    levelUp (oManager, oCreature) {
        // retrieve evolution data
        const sClassType = oCreature.getters.getClassType;
        const nLevel = oCreature.getters.getUnmodifiedLevel;
        if (nLevel >= 20) {
            return;
        }
        const {
            feats = [],
            removeFeats = [],
            abilityPoints = 0
        } = this.getClassTypeEvolutionLevelData(sClassType, nLevel);
        // remove feats
        removeFeats.forEach(feat => oManager.removeCreatureFeat(oCreature, feat));
        // add auto feats
        feats.forEach(feat => oManager.addCreatureFeat(oCreature, feat));
        // ability points
        oCreature.mutations.setPoolValue({
            pool: CONSTS.POOL_ABILITY_POINTS,
            value: oCreature.getters.getPoolValues[CONSTS.POOL_ABILITY_POINTS] + abilityPoints
        });
    }

    get experienceLevelTable () {
        return this._data['EXPERIENCE_LEVELS'].table;
    }

    getLevelFromXP (nXP) {
        const aTable = this.experienceLevelTable;
        let iLevel = 0;
        for (const xp of aTable) {
            if (xp > nXP) {
                return iLevel;
            }
            ++iLevel;
        }
        return iLevel;
    }

    getMinXPFromLevel (nLevel) {
        return this.experienceLevelTable[nLevel - 1];
    }

    getMaxXPFromLevel (nLevel) {
        return this.experienceLevelTable[nLevel];
    }

    // gainXP (oCreature, nXP) {
    //     const aTable = this._data['EVOLUTION_LEVELS'].table;
    //     const nCreatureXP = oCreature.getters.getPoolValues[CONSTS.POOL_EXPERIENCE_POINTS]
    //     const nCreatureLevel = oCreature.getters.getUnmodifiedLevel
    //     const nNewXP = nCreatureXP + nXP
    //     if (nXP >= 0) {
    //         let nLevel = 0
    //         for (const xp of aTable) {
    //             if (nXP)
    //         }
    //     }
    // }
}

module.exports = Evolution;
