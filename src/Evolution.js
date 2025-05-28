const CONSTS = require('./consts');
const Events = require('./events');

class Evolution {
    constructor ({ data }) {
        this._data = data;
        this._events = new Events();
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
     * Returns a specific level of an evolution data
     * @param sClassType {string}
     * @param nLevel {number}
     * @return {{ feats?: string[], removeFeats?: string[], level: number, abilityPoints: number }}
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

    getLevelUpRequiredXP (nLevel) {
        return nLevel < 1
            ? 0
            : nLevel <= 20
                ? this.experienceLevelTable[nLevel]
                : Infinity;
    }

    creatureEnterNewLevel (oCreature) {
        const nCurrentLevel = oCreature.getters.getUnmodifiedLevel;
        const sClassType = oCreature.getters.getClassType;
        const oClassTypeEvolutionData = this.getClassTypeEvolutionLevelData(sClassType, nCurrentLevel);
        if (oClassTypeEvolutionData) {
            const { feats, removeFeats, abilityPoints } = oClassTypeEvolutionData;
            this._events;
        }
    }

    /**
     * Increase experience points, if xp is higher than next level required xp, then increase level
     * @param oManager {Manager}
     * @param oCreature {Creature}
     * @param nXP {number}
     */
    gainXP (oManager, oCreature, nXP) {
        if (nXP > 0) {
            const nCurrentXP = oCreature.getters.getPoolValues[CONSTS.POOL_EXPERIENCE_POINTS];
            let nNewXP = nCurrentXP + nXP;
            do {
                const nCurrentLevel = oCreature.getters.getUnmodifiedLevel;
                const nRequiredXP = this.getLevelUpRequiredXP(nCurrentLevel + 1);
                if (nNewXP >= nRequiredXP) {
                    oCreature.mutations.setLevel({ value: nCurrentLevel + 1 });
                    this.events.emit(CONSTS.EVENT_CREATURE_LEVEL_UP);
                    this.creatureEnterNewLevel(oCreature);
                    nNewXP -= nRequiredXP;
                }
            } while (nNewXP > 0);
        }
    }
}

module.exports = Evolution;
