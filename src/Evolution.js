class Evolution {
    /**
     *
     * @param oManager {Manager}
     * @param oCreature {Creature}
     */
    levelUp (oManager, oCreature) {
        // retrieve evolution data
        const sClassType = oCreature.getters.getClassType;
        const sClassTypeDataKey = sClassType
            .toUpperCase()
            .replace(/-/g, '_');
        const oClassTypeData = oCreature.data[sClassTypeDataKey];
        const oEvolutionData = oClassTypeData['evolution'];
        const nLevel = oCreature.getters.getUnmodifiedLevel;
        if (nLevel < 20) {
            const nLevelUp = nLevel + 1;
            const oEvolutionNextLevelData = oEvolutionData['levels'].find(({ level }) => level === nLevelUp);
            if (oEvolutionNextLevelData) {
                const aNewFeats = oEvolutionNextLevelData.feats ?? [];

            }
        }
    }
}

module.exports = Evolution;
