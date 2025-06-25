const CONSTS = require('./consts');
const Events = require('node:events');
const CreatureLevelUpEvent = require('./events/CreatureLevelUpEvent');

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
        if (sClassTypeDataKey in this._data['CLASS_TYPES']) {
            return this._data['CLASS_TYPES'][sClassTypeDataKey];
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
        const cteld = this.getClassTypeEvolutionData(sClassType).levels.find(d => d.level === nLevel);
        if (!cteld) {
            throw new Error(`no level ${nLevel} definition in class type ${sClassType}`);
        }
        return cteld;
    }

    setupLevel (oManager, oCreature, nLevel) {
        // retrieve evolution data
        const sClassType = oCreature.getters.getClassType;
        if (nLevel >= 20) {
            return;
        }
        const {
            feats = [],
            removeFeats = [],
            abilityPoints = 0
        } = this.getClassTypeEvolutionLevelData(sClassType, nLevel);
        // remove feats
        removeFeats.forEach(feat => oManager.entityBuilder.removeCreatureFeat(oCreature, feat));
        // add auto feats
        feats.forEach(feat => oManager.entityBuilder.addCreatureFeat(oCreature, feat));
        // ability points
        oCreature.mutations.setPoolValue({
            pool: CONSTS.POOL_ABILITY_POINTS,
            value: oCreature.getters.getPoolValues[CONSTS.POOL_ABILITY_POINTS] + abilityPoints
        });
    }

    /**
     *
     * @param oManager {Manager}
     * @param oCreature {Creature}
     */
    levelUp (oManager, oCreature) {
        this.setupLevel(oManager, oCreature, oCreature.getters.getUnmodifiedLevel);
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

    creatureTriggerLevel (oCreature, nLevel) {
        const sClassType = oCreature.getters.getClassType;
        const oClassTypeEvolutionData = this.getClassTypeEvolutionLevelData(sClassType, nLevel);
        if (oClassTypeEvolutionData) {
            const { feats, removeFeats, abilityPoints = 0 } = oClassTypeEvolutionData;
            const oCreatureLevelUpEvent = new CreatureLevelUpEvent({
                creature: oCreature,
                feats: {
                    added: feats,
                    removed: removeFeats
                },
                abilityPoints
            });
            oCreature.events.emit(CONSTS.EVENT_CREATURE_LEVEL_UP, oCreatureLevelUpEvent);
        }
    }

    /**
     * Increase experience points, if xp is higher than next level required xp, then increase level
     * @param oCreature {Creature}
     * @param nXP {number}
     */
    gainXP (oCreature, nXP) {
        if (nXP > 0) {
            const nNewXP = oCreature.getters.getPoolValues[CONSTS.POOL_EXPERIENCE_POINTS] + nXP;
            oCreature.mutations.setPoolValue({ pool: CONSTS.POOL_EXPERIENCE_POINTS, value: nNewXP });
            while (nNewXP >= this.getLevelUpRequiredXP(oCreature.getters.getUnmodifiedLevel)) {
                const nNewLevel = oCreature.getters.getUnmodifiedLevel + 1;
                oCreature.mutations.setLevel({ value: nNewLevel });
                this.creatureTriggerLevel(oCreature, nNewLevel);
            }
        }
    }
}

module.exports = Evolution;
