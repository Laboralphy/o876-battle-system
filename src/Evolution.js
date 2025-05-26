class Evolution {
    constructor ({ data }) {
        this._data = data;
        this._classTypes = new Map();
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
     * @param selectFeats {{ [group: string]: string[] }}
     */
    levelUp (oManager, oCreature, selectFeats) {
        // retrieve evolution data
        const sClassType = oCreature.getters.getClassType;
        const nLevel = oCreature.getters.getUnmodifiedLevel;
        if (nLevel >= 20) {
            return;
        }
        const {
            feats = [],
            removeFeats = [],
            abilityPoints = 0,
            selectFeatGroups = []
        } = this.getClassTypeEvolutionLevelData(sClassType, nLevel);
        // remove feats
        removeFeats.forEach(feat => oManager.removeCreatureFeat(oCreature, feat));
        // add auto feats
        feats.forEach(feat => oManager.addCreatureFeat(oCreature, feat));
        // ability points
        oCreature.mutations.setPoolValue({ pool: 'abilityPoints', value: oCreature.getters.getPoolValues['abilityPoints'] + abilityPoints });
        // feat groups
        Object.entries(selectFeats).forEach(([ group, aFeats ]) => {
            aFeats.forEach(feat => {

            });
        });
    }
}

module.exports = Evolution;
